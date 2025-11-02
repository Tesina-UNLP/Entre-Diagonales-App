// libs/jwt.ts
function base64UrlDecode(input: string) {
  // JWT usa base64url (sin '+' '/' '=')
  input = input.replace(/-/g, '+').replace(/_/g, '/');
  const pad = input.length % 4;
  if (pad) input += '='.repeat(4 - pad);
  const decoded =
    typeof globalThis !== 'undefined' && typeof (globalThis as any).atob === 'function'
      ? (globalThis as any).atob(input)
      : Buffer.from(input, 'base64').toString('binary');
  try {
    // convierte "binary string" a UTF-8
    return decodeURIComponent(
      decoded
        .split('')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((c: any) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join('')
    );
  } catch {
    return decoded; // fallback
  }
}

export function decodeJwt<T = any>(token: string): T | null {
  try {
    const [, payload] = token.split('.');
    if (!payload) return null;
    return JSON.parse(base64UrlDecode(payload));
  } catch {
    return null;
  }
}

export function isTokenExpired(token?: string, skewSeconds = 15): boolean {
  if (!token) return true;
  const payload = decodeJwt<{ exp?: number }>(token);
  if (!payload?.exp) return true;
  const now = Math.floor(Date.now() / 1000);
  return now >= (payload.exp - skewSeconds); // con “skew” para relojes desincronizados
}

export function getTokenExpiresInSeconds(token?: string): number | null {
  if (!token) return null;
  const payload = decodeJwt<{ exp?: number }>(token);
  if (!payload?.exp) return null;
  const now = Math.floor(Date.now() / 1000);
  return Math.max(payload.exp - now, 0);
}
