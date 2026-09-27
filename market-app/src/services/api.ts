// src/services/api.ts
const API_URL = 'https://apimarket-production-c251.up.railway.app';

interface ApiErrorBody {
  message: string;
}

// Genérico <T> — cada llamada declara qué forma de datos espera recibir
export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    const error = data as ApiErrorBody;
    throw new Error(error.message ?? `Error ${response.status}`);
  }

  return data as T;
}