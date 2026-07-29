import { api } from './api';
import type { User, Session } from '../types';

export const userService = {
  /**
   * Retrieves list of all members.
   */
  async getMembers() {
    const response = await api.get<User[]>('/user/members');
    return response.data;
  },

  /**
   * Retrieves all active session IDs of the current user.
   */
  async getSessions() {
    const response = await api.get<Session[]>('/user/sessions');
    return response.data;
  },

  /**
   * Deletes a specific active session belonging to the logged-in user.
   */
  async deleteSession(sessionId: string) {
    const response = await api.delete<{ status: string }>(`/user/delete/session/${sessionId}/user`);
    return response.data;
  },

  /**
   * Revokes all active sessions for the current user.
   */
  async deleteAllSessions() {
    const response = await api.delete<{ status: string }>('/user/delete/all/sessions/user');
    return response.data;
  },

  /**
   * Deletes the current user's own account.
   */
  async deleteAccount() {
    const response = await api.delete<{ status: string }>('/user/delete/user/');
    return response.data;
  },

  /**
   * Submit profile details for the user.
   */
  async addProfile(profileData: any) {
    const response = await api.post<{ status: string }>('/user/add/profile', profileData);
    return response.data;
  },

  /**
   * Get the current user's own profile.
   */
  async getProfile() {
    const response = await api.get<any>('/user/profile');
    return response.data;
  },

  /**
   * Get another member's profile by user_id.
   */
  async getMemberProfile(userId: string) {
    const response = await api.get<any>(`/user/member/${userId}/profile`);
    return response.data;
  }
};
