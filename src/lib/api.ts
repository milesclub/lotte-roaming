// Thin HTTP client for the BFF. When VITE_API_BASE_URL is unset the app runs
// fully on the local mock adapters (the standalone demo); when it's set, the
// `*.ts` adapters route through here to the real backend.

export const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/+$/, '')
export const USE_BACKEND = API_BASE.length > 0
export const USE_OAUTH_REDIRECT = import.meta.env.VITE_USE_OAUTH_REDIRECT === 'true'

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public body?: unknown,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
  })
  const text = await res.text()
  const data = text ? JSON.parse(text) : undefined
  if (!res.ok) {
    const msg = (data && (data.error || data.message)) || res.statusText
    throw new ApiError(res.status, msg, data)
  }
  return data as T
}
