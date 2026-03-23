const BASE = (import.meta.env.VITE_API_URL ?? '') + '/api';

function getToken() {
  return localStorage.getItem('token');
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers ?? {}),
  };
  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error((err as { error?: string }).error ?? 'Request failed');
  }
  return res.json();
}

/**
 * Convert a stored upload URL like /uploads/submissions/uuid.pdf
 * into a force-download URL /api/upload/download/submissions/uuid.pdf?name=original.pdf
 */
export function toDownloadUrl(url: string | null | undefined, originalName?: string | null): string {
  if (!url) return '#';
  // Match /uploads/<type>/<filename>
  const m = url.match(/^\/uploads\/(avatars|covers|submissions)\/(.+)$/);
  if (!m) return url; // not a managed upload, return as-is
  const [, type, filename] = m;
  const base = `${import.meta.env.VITE_API_URL ?? ''}/api/upload/download/${type}/${encodeURIComponent(filename)}`;
  return originalName ? `${base}?name=${encodeURIComponent(originalName)}` : base;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};
