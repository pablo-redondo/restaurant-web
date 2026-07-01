export interface User {
  id: number;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  created_at: string;
}

export interface Table {
  id: number;
  number: number;
  capacity: number;
  location: 'interior' | 'terraza';
  is_active: boolean;
}

export interface Reservation {
  id: number;
  user_id: number;
  table_id: number;
  date: string;
  time: string;
  guests: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  notes?: string;
  created_at: string;
  user_name?: string;
  user_email?: string;
  table_number?: number;
  review_id?: number | null;
  review_rating?: number | null;
  review_comment?: string | null;
}

export interface Review {
  id: number;
  user_id: number;
  reservation_id: number;
  rating: number;
  comment?: string;
  created_at: string;
  user_name?: string;
}

export interface ApiError {
  error?: string;
  errors?: { field: string; message: string }[];
}
