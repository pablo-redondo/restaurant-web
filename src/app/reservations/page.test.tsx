import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ReservationsPage from './page';
import { tablesApi, reservationsApi, ApiRequestError } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

// Estos son los dos componentes clave del flujo de reserva: el formulario de
// reserva (pasos 1 y 3) y el listado de disponibilidad (paso 2), ambos viven
// en esta misma página. Se mockea el cliente de la API (@/lib/api) para no
// depender de restaurant-api real, y useAuth para controlar el estado de sesión.

jest.mock('@/lib/api', () => ({
  // Se conservan las funciones/clases reales (ApiRequestError, describeApiError)
  // y solo se mockean los objetos de API que hacen peticiones de red.
  ...jest.requireActual('@/lib/api'),
  tablesApi: { list: jest.fn() },
  reservationsApi: { create: jest.fn() },
}));

jest.mock('@/context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

const push = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}));

const mockedTablesList = tablesApi.list as jest.Mock;
const mockedReservationsCreate = reservationsApi.create as jest.Mock;
const mockedUseAuth = useAuth as jest.Mock;

const ACTIVE_INTERIOR_TABLE = { id: 1, number: 3, capacity: 4, location: 'interior', is_active: true };
const INACTIVE_TABLE = { id: 2, number: 9, capacity: 2, location: 'interior', is_active: false };

function selectDateAndTime() {
  // Cualquier día habilitado del calendario (no pasado) sirve para el test;
  // se elige el primer botón de día no deshabilitado.
  const dayButtons = screen.getAllByRole('button').filter((b) => /^\d+$/.test(b.textContent ?? ''));
  const enabledDay = dayButtons.find((b) => !(b as HTMLButtonElement).disabled);
  if (!enabledDay) throw new Error('No hay ningún día habilitado en el calendario para el test');
  return enabledDay;
}

async function goToAvailability(user: ReturnType<typeof userEvent.setup>) {
  await user.click(selectDateAndTime());
  await user.click(screen.getByRole('button', { name: '13:00' }));
  await user.click(screen.getByRole('button', { name: 'Continuar' }));
}

describe('Flujo de reserva — formulario y listado de disponibilidad', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();
  });

  it('mantiene "Continuar" deshabilitado hasta elegir fecha y hora', async () => {
    mockedUseAuth.mockReturnValue({ user: null, loading: false });
    render(<ReservationsPage />);

    const continuar = screen.getByRole('button', { name: 'Continuar' });
    expect(continuar).toBeDisabled();

    const user = userEvent.setup();
    await user.click(selectDateAndTime());
    await user.click(screen.getByRole('button', { name: '13:00' }));

    expect(continuar).toBeEnabled();
  });

  it('avanza al paso 2 de inmediato y muestra el estado de carga mientras busca mesas (regresión del bug de control de flujo)', async () => {
    // Antes, `setStep(2)` corría DESPUÉS de que tablesApi.list resolviera, así
    // que el usuario se quedaba en el paso 1 sin ningún indicador mientras la
    // API respondía: el texto "Buscando mesas disponibles..." nunca llegaba a
    // pintarse. Ahora el paso cambia de inmediato y la carga ocurre ya dentro
    // del paso 2 — este test usa una promesa controlada manualmente para
    // comprobar que ese estado intermedio es real y visible.
    mockedUseAuth.mockReturnValue({ user: null, loading: false });
    let resolveList!: (v: { tables: typeof ACTIVE_INTERIOR_TABLE[]; total: number }) => void;
    mockedTablesList.mockReturnValue(new Promise((resolve) => { resolveList = resolve; }));

    const user = userEvent.setup();
    render(<ReservationsPage />);

    await user.click(selectDateAndTime());
    await user.click(screen.getByRole('button', { name: '13:00' }));
    await user.click(screen.getByRole('button', { name: 'Continuar' }));

    // El paso 1 ya no está (el título de "Fecha" desaparece) y, en su lugar,
    // se ve el estado de carga del paso 2, con el aviso de cold start (es la
    // primera petición de la página).
    expect(screen.getByText('Buscando mesas disponibles...')).toBeInTheDocument();
    expect(screen.getByText(/Conectando con el servidor/)).toBeInTheDocument();

    resolveList({ tables: [ACTIVE_INTERIOR_TABLE, INACTIVE_TABLE], total: 2 });

    // Solo se lista la mesa activa; la #9 (inactiva) debe quedar filtrada.
    await waitFor(() => {
      expect(screen.getByText('Mesa 3')).toBeInTheDocument();
    });
    expect(screen.queryByText('Mesa 9')).not.toBeInTheDocument();
    expect(screen.queryByText('Buscando mesas disponibles...')).not.toBeInTheDocument();
    expect(mockedTablesList).toHaveBeenCalledWith(
      expect.objectContaining({ time: '13:00', guests: 2 })
    );
  });

  it('el aviso de cold start no se repite en una segunda búsqueda de la misma visita', async () => {
    mockedUseAuth.mockReturnValue({ user: null, loading: false });
    mockedTablesList.mockResolvedValue({ tables: [ACTIVE_INTERIOR_TABLE], total: 1 });

    const user = userEvent.setup();
    render(<ReservationsPage />);

    await goToAvailability(user);
    await waitFor(() => screen.getByText('Mesa 3'));

    // Volvemos al paso 1 y repetimos la búsqueda.
    await user.click(screen.getByRole('button', { name: 'Atrás' }));
    await user.click(screen.getByRole('button', { name: 'Continuar' }));

    expect(screen.queryByText(/Conectando con el servidor/)).not.toBeInTheDocument();
  });

  it('muestra un mensaje claro cuando no hay mesas disponibles en la zona', async () => {
    mockedUseAuth.mockReturnValue({ user: null, loading: false });
    mockedTablesList.mockResolvedValue({ tables: [], total: 0 });

    const user = userEvent.setup();
    render(<ReservationsPage />);

    await goToAvailability(user);

    await waitFor(() => {
      expect(screen.getByText('No hay mesas disponibles en interior.')).toBeInTheDocument();
    });
  });

  it('si falla la red al buscar disponibilidad, distingue el error de un listado vacío y permite reintentar', async () => {
    mockedUseAuth.mockReturnValue({ user: null, loading: false });
    mockedTablesList.mockRejectedValueOnce(
      new ApiRequestError('network', 'No se pudo conectar con el servidor. Comprueba tu conexión e inténtalo de nuevo.')
    );
    mockedTablesList.mockResolvedValueOnce({ tables: [ACTIVE_INTERIOR_TABLE], total: 1 });

    const user = userEvent.setup();
    render(<ReservationsPage />);

    await goToAvailability(user);

    await waitFor(() => {
      expect(
        screen.getByText('No se pudo conectar con el servidor. Comprueba tu conexión e inténtalo de nuevo.')
      ).toBeInTheDocument();
    });
    // No debe confundirse con el estado vacío legítimo.
    expect(screen.queryByText('No hay mesas disponibles en interior.')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Reintentar' }));

    await waitFor(() => {
      expect(screen.getByText('Mesa 3')).toBeInTheDocument();
    });
    expect(mockedTablesList).toHaveBeenCalledTimes(2);
  });

  it('si la API responde con un error 5xx al buscar disponibilidad, muestra un mensaje genérico de servidor', async () => {
    mockedUseAuth.mockReturnValue({ user: null, loading: false });
    mockedTablesList.mockRejectedValue(
      new ApiRequestError('http', 'Internal Server Error', { status: 500 })
    );

    const user = userEvent.setup();
    render(<ReservationsPage />);

    await goToAvailability(user);

    await waitFor(() => {
      expect(
        screen.getByText('El servidor ha tenido un problema al procesar la solicitud. Inténtalo de nuevo en unos segundos.')
      ).toBeInTheDocument();
    });
  });

  it('si no hay sesión, al confirmar guarda el borrador y redirige a login en vez de reservar', async () => {
    mockedUseAuth.mockReturnValue({ user: null, loading: false });
    mockedTablesList.mockResolvedValue({ tables: [ACTIVE_INTERIOR_TABLE], total: 1 });

    const user = userEvent.setup();
    render(<ReservationsPage />);

    await goToAvailability(user);
    await waitFor(() => screen.getByText('Mesa 3'));
    await user.click(screen.getByText('Mesa 3').closest('button')!);
    await user.click(screen.getByRole('button', { name: 'Continuar' }));

    await user.click(screen.getByRole('button', { name: 'Inicia sesión para reservar' }));

    expect(mockedReservationsCreate).not.toHaveBeenCalled();
    expect(push).toHaveBeenCalledWith('/login?redirect=/reservations');
    expect(sessionStorage.getItem('pendingReservation')).not.toBeNull();
  });

  it('con sesión iniciada, confirma la reserva y muestra la pantalla de éxito', async () => {
    mockedUseAuth.mockReturnValue({ user: { id: 1, name: 'Ana', role: 'customer' }, loading: false });
    mockedTablesList.mockResolvedValue({ tables: [ACTIVE_INTERIOR_TABLE], total: 1 });
    mockedReservationsCreate.mockResolvedValue({ reservation: { id: 42 } });

    const user = userEvent.setup();
    render(<ReservationsPage />);

    await goToAvailability(user);
    await waitFor(() => screen.getByText('Mesa 3'));
    await user.click(screen.getByText('Mesa 3').closest('button')!);
    await user.click(screen.getByRole('button', { name: 'Continuar' }));

    await user.click(screen.getByRole('button', { name: 'Solicitar reserva' }));

    await waitFor(() => {
      expect(screen.getByText('Solicitud enviada')).toBeInTheDocument();
    });
    expect(screen.getByText('Ref: MRQ-00042')).toBeInTheDocument();
  });

  it('si la API rechaza la reserva, muestra el mensaje de error y no navega a la pantalla de éxito', async () => {
    mockedUseAuth.mockReturnValue({ user: { id: 1, name: 'Ana', role: 'customer' }, loading: false });
    mockedTablesList.mockResolvedValue({ tables: [ACTIVE_INTERIOR_TABLE], total: 1 });
    mockedReservationsCreate.mockRejectedValue(
      new ApiRequestError('http', 'La mesa ya está reservada en ese horario', { status: 409 })
    );

    const user = userEvent.setup();
    render(<ReservationsPage />);

    await goToAvailability(user);
    await waitFor(() => screen.getByText('Mesa 3'));
    await user.click(screen.getByText('Mesa 3').closest('button')!);
    await user.click(screen.getByRole('button', { name: 'Continuar' }));

    await user.click(screen.getByRole('button', { name: 'Solicitar reserva' }));

    await waitFor(() => {
      expect(screen.getByText('La mesa ya está reservada en ese horario')).toBeInTheDocument();
    });
    expect(screen.queryByText('Solicitud enviada')).not.toBeInTheDocument();
  });
});
