export const API_URL = import.meta.env.VITE_API_URL;

export async function loginRequest(email, password) {
  let response;
  try {
    response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
  } catch {
    throw new Error('No pudimos conectar con el servidor. Intentá de nuevo.');
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data?.error?.message || 'No pudimos iniciar sesión. Intentá de nuevo.');
  }

  return data.user;
}
