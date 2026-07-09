import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginPage from './page';
import { useAuth } from '@/context/AuthContext';

jest.mock('@/context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

const push = jest.fn();
const searchParamsGet = jest.fn().mockReturnValue(null);
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
  useSearchParams: () => ({ get: searchParamsGet }),
}));

const mockedUseAuth = useAuth as jest.Mock;

describe('Formulario de inicio de sesión', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    searchParamsGet.mockReturnValue(null);
  });

  it('los campos están correctamente asociados a su etiqueta (accesibilidad)', () => {
    mockedUseAuth.mockReturnValue({ login: jest.fn() });
    render(<LoginPage />);

    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument();
  });

  it('tras iniciar sesión como cliente, redirige a "Mis reservas"', async () => {
    const login = jest.fn().mockResolvedValue({ id: 1, name: 'Ana', role: 'customer' });
    mockedUseAuth.mockReturnValue({ login });

    const user = userEvent.setup();
    render(<LoginPage />);

    await user.type(screen.getByLabelText('Email'), 'ana@example.com');
    await user.type(screen.getByLabelText('Contraseña'), 'secreto123');
    await user.click(screen.getByRole('button', { name: 'Iniciar sesión' }));

    await waitFor(() => expect(push).toHaveBeenCalledWith('/reservations/me'));
    expect(login).toHaveBeenCalledWith('ana@example.com', 'secreto123');
  });

  it('tras iniciar sesión como admin, redirige al panel', async () => {
    const login = jest.fn().mockResolvedValue({ id: 1, name: 'Admin', role: 'admin' });
    mockedUseAuth.mockReturnValue({ login });

    const user = userEvent.setup();
    render(<LoginPage />);

    await user.type(screen.getByLabelText('Email'), 'admin@example.com');
    await user.type(screen.getByLabelText('Contraseña'), 'secreto123');
    await user.click(screen.getByRole('button', { name: 'Iniciar sesión' }));

    await waitFor(() => expect(push).toHaveBeenCalledWith('/admin'));
  });

  it('si las credenciales son inválidas, muestra el error de la API y no navega', async () => {
    const login = jest.fn().mockRejectedValue({ error: 'Credenciales inválidas' });
    mockedUseAuth.mockReturnValue({ login });

    const user = userEvent.setup();
    render(<LoginPage />);

    await user.type(screen.getByLabelText('Email'), 'ana@example.com');
    await user.type(screen.getByLabelText('Contraseña'), 'incorrecta');
    await user.click(screen.getByRole('button', { name: 'Iniciar sesión' }));

    await waitFor(() => {
      expect(screen.getByText('Credenciales inválidas')).toBeInTheDocument();
    });
    expect(push).not.toHaveBeenCalled();
  });
});
