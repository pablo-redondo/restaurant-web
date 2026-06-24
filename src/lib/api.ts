const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
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

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw data;
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
