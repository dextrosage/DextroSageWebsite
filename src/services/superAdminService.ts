import { api } from './api';
import type { User, Session } from '../types';

export const superAdminService = {
  /**
   * Retrieves list of all members (calls admin endpoint).
   */
  async getMembers() {
    const response = await api.get<User[]>('/admin/members');
    return response.data;
  },

  /**
   * Retrieves all active sessions of a specific member by user_id (SADMIN endpoint).
   */
  async getMemberSessions(userId: string) {
    const response = await api.get<Session[]>(`/super-admin/member/${userId}/sessions`);
    return response.data;
  },

  /**
   * Terminate a specific session of any member (SADMIN endpoint).
   */
  async deleteSession(sessionId: string) {
    const response = await api.delete<{ status: string }>(`/super-admin/delete/session/${sessionId}/member`);
    return response.data;
  },

  /**
   * Terminate all sessions of a specific member (SADMIN endpoint).
   */
  async deleteAllSessions(userId: string) {
    const response = await api.delete<{ status: string }>(`/super-admin/delete/all/sessions/member/${userId}`);
    return response.data;
  },

  /**
   * Deletes any user account completely (SADMIN endpoint).
   */
  async deleteMember(userId: string) {
    const response = await api.delete<{ status: string }>(`/super-admin/delete/${userId}/members`);
    return response.data;
  },

  /**
   * Submit profile details for the super admin (SADMIN endpoint).
   */
  async addProfile(profileData: any) {
    const response = await api.post<{ status: string }>('/super-admin/add/profile', profileData);
    return response.data;
  },

  /**
   * Get the super admin's own profile (calls standard user profile).
   */
  async getProfile() {
    const response = await api.get<any>('/user/profile');
    return response.data;
  },

  /**
   * Get any user's profile by user_id (SADMIN endpoint).
   */
  async getMemberProfile(userId: string) {
    const response = await api.get<any>(`/super-admin/member/${userId}/profile`);
    return response.data;
  }
};
