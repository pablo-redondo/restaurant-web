import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ReservationsPage from './page';
import { tablesApi, reservationsApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

// Estos son los dos componentes clave del flujo de reserva: el formulario de
// reserva (pasos 1 y 3) y el listado de disponibilidad (paso 2), ambos viven
// en esta misma página. Se mockea el cliente de la API (@/lib/api) para no
// depender de restaurant-api real, y useAuth para controlar el estado de sesión.

jest.mock('@/lib/api', () => ({
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

  it('muestra el listado de disponibilidad tras elegir fecha/hora, filtrando mesas inactivas', async () => {
    // Nota: el paso 2 (donde vive el mensaje "Buscando mesas disponibles...")
    // solo se activa DESPUÉS de que tablesApi.list resuelve (ver goToStep2 en
    // page.tsx: `setStep(2)` corre tras el finally del fetch). Es decir, ese
    // estado de carga es efectivamente inalcanzable con el control flow
    // actual: el usuario se queda en el paso 1 sin ningún indicador mientras
    // la API responde. Se señala como hallazgo en docs/AUDIT.md; este test
    // cubre el resultado (listado correcto, mesas inactivas filtradas) que sí
    // es observable.
    mockedUseAuth.mockReturnValue({ user: null, loading: false });
    mockedTablesList.mockResolvedValue({ tables: [ACTIVE_INTERIOR_TABLE, INACTIVE_TABLE], total: 2 });

    const user = userEvent.setup();
    render(<ReservationsPage />);

    await user.click(selectDateAndTime());
    await user.click(screen.getByRole('button', { name: '13:00' }));
    await user.click(screen.getByRole('button', { name: 'Continuar' }));

    // Solo se lista la mesa activa; la #9 (inactiva) debe quedar filtrada.
    await waitFor(() => {
      expect(screen.getByText('Mesa 3')).toBeInTheDocument();
    });
    expect(screen.queryByText('Mesa 9')).not.toBeInTheDocument();
    expect(mockedTablesList).toHaveBeenCalledWith(
      expect.objectContaining({ time: '13:00', guests: 2 })
    );
  });

  it('muestra un mensaje claro cuando no hay mesas disponibles en la zona', async () => {
    mockedUseAuth.mockReturnValue({ user: null, loading: false });
    mockedTablesList.mockResolvedValue({ tables: [], total: 0 });

    const user = userEvent.setup();
    render(<ReservationsPage />);

    await user.click(selectDateAndTime());
    await user.click(screen.getByRole('button', { name: '13:00' }));
    await user.click(screen.getByRole('button', { name: 'Continuar' }));

    await waitFor(() => {
      expect(screen.getByText('No hay mesas disponibles en interior.')).toBeInTheDocument();
    });
  });

  it('si no hay sesión, al confirmar guarda el borrador y redirige a login en vez de reservar', async () => {
    mockedUseAuth.mockReturnValue({ user: null, loading: false });
    mockedTablesList.mockResolvedValue({ tables: [ACTIVE_INTERIOR_TABLE], total: 1 });

    const user = userEvent.setup();
    render(<ReservationsPage />);

    await user.click(selectDateAndTime());
    await user.click(screen.getByRole('button', { name: '13:00' }));
    await user.click(screen.getByRole('button', { name: 'Continuar' }));
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

    await user.click(selectDateAndTime());
    await user.click(screen.getByRole('button', { name: '13:00' }));
    await user.click(screen.getByRole('button', { name: 'Continuar' }));
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
    mockedReservationsCreate.mockRejectedValue({ error: 'La mesa ya está reservada en ese horario' });

    const user = userEvent.setup();
    render(<ReservationsPage />);

    await user.click(selectDateAndTime());
    await user.click(screen.getByRole('button', { name: '13:00' }));
    await user.click(screen.getByRole('button', { name: 'Continuar' }));
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
