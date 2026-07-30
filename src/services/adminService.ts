import { api } from './api';
import type { User, Session } from '../types';

export const adminService = {
  /**
   * Retrieves list of all members inside the database.
   */
  async getMembers(skip: number = 0, limit: number = 10) {
    const response = await api.get<User[]>(`/admin/members?skip=${skip}&limit=${limit}`);
    return response.data;
  },

  /**
   * Retrieves own active sessions (admin endpoint).
   */
  async getMemberSessions(_userId?: string) {
    const response = await api.get<Session[]>('/admin/member/sessions');
    return response.data;
  },

  /**
   * Retrieves all active sessions of the logged-in admin themselves.
   */
  async getOwnSessions() {
    const response = await api.get<Session[]>('/admin/member/sessions');
    return response.data;
  },

  /**
   * Terminate a specific session of any member.
   */
  async deleteSession(sessionId: string) {
    const response = await api.delete<{ status: string }>(`/admin/delete/session/${sessionId}/member`);
    return response.data;
  },

  /**
   * Terminate all own active sessions (admin endpoint).
   */
  async deleteAllSessions(_userId?: string) {
    const response = await api.delete<{ status: string }>('/admin/delete/all/sessions/member/');
    return response.data;
  },

  /**
   * Deletes a user account (admin endpoint).
   */
  async deleteMember(userId: string) {
    const response = await api.delete<{ status: string }>(`/admin/delete/${userId}/members`);
    return response.data;
  },

  /**
   * Submit profile details for the admin.
   */
  async addProfile(profileData: any) {
    const response = await api.post<{ status: string }>('/admin/add/profile', profileData);
    return response.data;
  },

  /**
   * Get the admin's own profile.
   */
  async getProfile() {
    const response = await api.get<any>('/user/profile');
    return response.data;
  },

  /**
   * Get any user's profile by user_id (admin endpoint).
   */
  async getMemberProfile(userId: string) {
    const response = await api.get<any>(`/admin/member/${userId}/profile`);
    return response.data;
  }
};
