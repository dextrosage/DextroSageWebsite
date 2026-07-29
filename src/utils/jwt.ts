import type { DecodedToken } from '../types';

/**
 * Decodes a JWT token payload locally without external libraries.
 */
export function decodeJwt(token: string): DecodedToken | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload) as DecodedToken;
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
}

/**
 * Checks if a JWT token is expired.
 */
export function isTokenExpired(token: string): boolean {
  const decoded = decodeJwt(token);
  if (!decoded) return true;
  return decoded.exp * 1000 < Date.now();
}

/**
 * Returns the time remaining for a token in seconds.
 */
export function getTokenTimeRemaining(token: string): number {
  const decoded = decodeJwt(token);
  if (!decoded) return 0;
  return Math.max(0, Math.floor((decoded.exp * 1000 - Date.now()) / 1000));
}
