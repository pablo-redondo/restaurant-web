const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

export type ApiErrorKind = 'network' | 'invalid_response' | 'http';

/**
 * Error unificado para toda petición a la API. Distingue tres causas:
 *  - 'network': fetch() no llegó a completarse (sin conexión, CORS, DNS, API caída).
 *  - 'invalid_response': el servidor respondió pero el cuerpo no es JSON válido
 *    (p. ej. una página de error HTML de Fly.io/Vercel en un 502/504).
 *  - 'http': la API respondió con un JSON válido pero un status de error (4xx/5xx).
 *
 * Mantiene `error` (y `errors`, para errores de validación) como propiedades
 * planas por compatibilidad: el código existente que hace
 * `catch (err) { (err as {error?: string}).error }` sigue funcionando igual
 * que antes, sin necesidad de tocar cada punto de consumo.
 */
export class ApiRequestError extends Error {
  kind: ApiErrorKind;
  status?: number;
  error: string;
  errors?: { field: string; message: string }[];

  constructor(
    kind: ApiErrorKind,
    message: string,
    opts?: { status?: number; errors?: { field: string; message: string }[] }
  ) {
    super(message);
    this.name = 'ApiRequestError';
    this.kind = kind;
    this.error = message;
    this.status = opts?.status;
    this.errors = opts?.errors;
  }
}

/** Traduce un error de request() a un mensaje listo para mostrar al usuario. */
export function describeApiError(err: unknown): string {
  if (err instanceof ApiRequestError) {
    if (err.kind === 'network' || err.kind === 'invalid_response') return err.message;
    // 'http': para 5xx mostramos un mensaje genérico (el cuerpo puede no ser
    // útil para el usuario final); para 4xx respetamos el mensaje de la API.
    if (err.status && err.status >= 500) {
      return 'El servidor ha tenido un problema al procesar la solicitud. Inténtalo de nuevo en unos segundos.';
    }
    return err.message;
  }
  return 'Ha ocurrido un error inesperado. Inténtalo de nuevo.';
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  } catch {
    throw new ApiRequestError(
      'network',
      'No se pudo conectar con el servidor. Comprueba tu conexión e inténtalo de nuevo.'
    );
  }

  let data: unknown;
  try {
    data = await res.json();
  } catch {
    throw new ApiRequestError(
      'invalid_response',
      'El servidor ha devuelto una respuesta inesperada. Inténtalo de nuevo en unos segundos.',
      { status: res.status }
    );
  }

  if (!res.ok) {
    const body = data as { error?: string; errors?: { field: string; message: string }[] };
    throw new ApiRequestError('http', body?.error ?? 'Ha ocurrido un error.', {
      status: res.status,
      errors: body?.errors,
    });
  }

  return data as T;
}

// Auth
export const authApi = {
  login: (email: string, password: string) =>
    request<{ user: import('@/types').User; token: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  register: (name: string, email: string, password: string) =>
    request<{ user: import('@/types').User; token: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),
  me: () =>
    request<{ user: import('@/types').User }>('/api/auth/me'),
};

// Tables
export const tablesApi = {
  list: (params?: { date?: string; time?: string; guests?: number; location?: string; includeInactive?: boolean }) => {
    const qs = new URLSearchParams();
    if (params?.date)            qs.set('date',            params.date);
    if (params?.time)            qs.set('time',            params.time);
    if (params?.guests)          qs.set('guests',          String(params.guests));
    if (params?.location)        qs.set('location',        params.location);
    if (params?.includeInactive) qs.set('includeInactive', 'true');
    return request<{ tables: import('@/types').Table[]; total: number }>(
      `/api/tables${qs.toString() ? '?' + qs.toString() : ''}`
    );
  },
  create: (data: { number: number; capacity: number; location?: string }) =>
    request<{ table: import('@/types').Table }>('/api/tables', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: number, data: Partial<{ capacity: number; location: string; is_active: boolean }>) =>
    request<{ table: import('@/types').Table }>(`/api/tables/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
};

// Reservations
export const reservationsApi = {
  create: (data: { table_id: number; date: string; time: string; guests: number; notes?: string }) =>
    request<{ reservation: import('@/types').Reservation }>('/api/reservations', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  listAll: (params?: { date?: string; status?: string; page?: number; limit?: number }) => {
    const qs = new URLSearchParams();
    if (params?.date)   qs.set('date',   params.date);
    if (params?.status) qs.set('status', params.status);
    if (params?.page)   qs.set('page',   String(params.page));
    if (params?.limit)  qs.set('limit',  String(params.limit));
    return request<{ reservations: import('@/types').Reservation[]; page: number; total: number }>(
      `/api/reservations${qs.toString() ? '?' + qs.toString() : ''}`
    );
  },
  listMine: (params?: { status?: string; page?: number }) => {
    const qs = new URLSearchParams();
    if (params?.status) qs.set('status', params.status);
    if (params?.page)   qs.set('page',   String(params.page));
    return request<{ reservations: import('@/types').Reservation[]; page: number }>(
      `/api/reservations/me${qs.toString() ? '?' + qs.toString() : ''}`
    );
  },
  get: (id: number) =>
    request<{ reservation: import('@/types').Reservation }>(`/api/reservations/${id}`),
  update: (id: number, data: { status?: string; notes?: string }) =>
    request<{ reservation: import('@/types').Reservation }>(`/api/reservations/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
};

// Reviews
export const reviewsApi = {
  list: (params?: { page?: number; limit?: number }) => {
    const qs = new URLSearchParams();
    if (params?.page)  qs.set('page',  String(params.page));
    if (params?.limit) qs.set('limit', String(params.limit));
    return request<{ reviews: import('@/types').Review[]; average_rating: number | null; total: number; page: number }>(
      `/api/reviews${qs.toString() ? '?' + qs.toString() : ''}`
    );
  },
  create: (data: { reservation_id: number; rating: number; comment?: string }) =>
    request<{ review: import('@/types').Review }>('/api/reviews', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};
