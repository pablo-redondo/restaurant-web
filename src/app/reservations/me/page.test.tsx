import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MyReservationsPage from './page';
import { reservationsApi, ApiRequestError } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

// Cubre el mismo patrón de fix que reservations/page.test.tsx (distinguir
// "sin datos" de "fallo de red/API" en un listado), aplicado a otro de los
// puntos señalados en docs/AUDIT.md.

jest.mock('@/lib/api', () => ({
  ...jest.requireActual('@/lib/api'),
  reservationsApi: { listMine: jest.fn() },
}));

jest.mock('@/context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

const push = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}));

const mockedListMine = reservationsApi.listMine as jest.Mock;
const mockedUseAuth = useAuth as jest.Mock;

const RESERVATION = {
  id: 4, user_id: 1, table_id: 2, date: '2026-07-15', time: '21:00',
  guests: 2, status: 'confirmed' as const, created_at: '2026-06-01',
};

describe('Mis reservas — listado', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseAuth.mockReturnValue({ user: { id: 1, name: 'Ana', role: 'customer' }, loading: false });
  });

  it('si falla la red, distingue el error de tener 0 reservas y permite reintentar', async () => {
    mockedListMine.mockRejectedValueOnce(
      new ApiRequestError('network', 'No se pudo conectar con el servidor. Comprueba tu conexión e inténtalo de nuevo.')
    );
    mockedListMine.mockResolvedValueOnce({ reservations: [RESERVATION], page: 1 });

    render(<MyReservationsPage />);

    await waitFor(() => {
      expect(
        screen.getByText('No se pudo conectar con el servidor. Comprueba tu conexión e inténtalo de nuevo.')
      ).toBeInTheDocument();
    });
    // No debe confundirse con el estado vacío legítimo ("No tienes reservas").
    expect(screen.queryByText(/No tienes reservas/)).not.toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Reintentar' }));

    await waitFor(() => {
      expect(screen.getByText('Reserva #4')).toBeInTheDocument();
    });
    expect(mockedListMine).toHaveBeenCalledTimes(2);
  });

  it('si la API responde con un error del servidor, muestra un mensaje distinto al de un listado vacío', async () => {
    mockedListMine.mockRejectedValue(new ApiRequestError('http', 'Internal Server Error', { status: 503 }));

    render(<MyReservationsPage />);

    await waitFor(() => {
      expect(
        screen.getByText('El servidor ha tenido un problema al procesar la solicitud. Inténtalo de nuevo en unos segundos.')
      ).toBeInTheDocument();
    });
  });

  it('sin error, una lista vacía muestra el estado "no tienes reservas" normal', async () => {
    mockedListMine.mockResolvedValue({ reservations: [], page: 1 });

    render(<MyReservationsPage />);

    await waitFor(() => {
      expect(screen.getByText('No tienes reservas.')).toBeInTheDocument();
    });
  });
});
