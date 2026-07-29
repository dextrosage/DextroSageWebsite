import { api } from './api';
import type { Announcement } from '../types';

export const announcementService = {
  /**
   * Fetch all announcements. Available to all authenticated users.
   */
  async getAnnouncements(skip: number = 0, limit: number = 10): Promise<Announcement[]> {
    const response = await api.get<Announcement[]>(`/announcements?skip=${skip}&limit=${limit}`);
    return response.data;
  },

  /**
   * Create an announcement. (ADMIN/SADMIN only)
   */
  async createAnnouncement(title: string, content: string, videoLinks: string[]): Promise<{ status: string }> {
    const response = await api.post<{ status: string }>('/announcements/admin', { title, content, video_links: videoLinks });
    return response.data;
  },

  /**
   * Update an announcement. (ADMIN/SADMIN only)
   */
  async updateAnnouncement(id: string, title?: string, content?: string, videoLinks?: string[]): Promise<{ status: string }> {
    const response = await api.put<{ status: string }>(`/announcements/admin/${id}`, { title, content, video_links: videoLinks });
    return response.data;
  },

  /**
   * Delete an announcement. (ADMIN/SADMIN only)
   */
  async deleteAnnouncement(id: string): Promise<{ status: string }> {
    const response = await api.delete<{ status: string }>(`/announcements/admin/${id}`);
    return response.data;
  }
};
