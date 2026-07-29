import { api } from './api';
import type { LoginRequest, SignUpRequest, AuthTokens } from '../types';

export const authService = {
  /**
   * Health check to ping the backend.
   */
  async checkPing() {
    const response = await api.get<{ status: string }>('/auth/week5');
    return response.data;
  },

  /**
   * Log in user and retrieve Access and Refresh tokens.
   */
  async login(data: LoginRequest) {
    const response = await api.post<AuthTokens>('/auth/login', data);
    return response.data;
  },

  /**
   * Verify/register phone number for the user session (PATCH /auth/verify/phone).
   */
  async verifyPhone(phno: string) {
    const response = await api.patch<{ status: string }>('/auth/verify/phone', { phno });
    return response.data;
  },

  /**
   * Change user password (PATCH /auth/change/password).
   */
  async changePassword(password: string) {
    const response = await api.patch<{ status: string }>('/auth/change/password', { password });
    return response.data;
  },

  /**
   * Register a new user (requires ADMIN role).
   */
  async signup(data: SignUpRequest) {
    const response = await api.post<{ status: string; email: string }>('/auth/signup', data);
    return response.data;
  },

  /**
   * Register a new user (requires SADMIN role).
   */
  async sadminSignup(data: SignUpRequest) {
    const response = await api.post<{ status: string; email: string }>('/auth/sadmin/signup', data);
    return response.data;
  },

  /**
   * Add profile (POST /auth/add/profile).
   */
  async addProfile(payload: any) {
    const response = await api.post<{ status: string }>('/auth/add/profile', payload);
    return response.data;
  },

  /**
   * Log out the active session.
   */
  async logout() {
    const response = await api.post<{ status: string }>('/auth/logout');
    return response.data;
  }
};
