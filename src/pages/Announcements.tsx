import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { announcementService } from '../services/announcementService';
import type { Announcement } from '../types';
import { AnnouncementCard } from '../components/AnnouncementCard';
import { AnnouncementModal } from '../components/AnnouncementModal';
import { Loader } from '../components/ui/Loader';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { PlusCircle, RefreshCw, Radio } from 'lucide-react';

export const Announcements: React.FC = () => {
  const { role } = useAuth();
  const { showSuccess, showApiError } = useToast();

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const LIMIT = 10;

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete States
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const isAdminOrSadmin = role === 'ADMIN' || role === 'SADMIN';

  const fetchAnnouncements = useCallback(async (quiet = false, reset = false) => {
    if (!quiet && reset) setIsLoading(true);
    else if (!quiet && !reset) setIsLoadingMore(true);
    else if (reset) setIsRefreshing(true);

    try {
      const currentSkip = reset ? 0 : announcements.length;
      const data = await announcementService.getAnnouncements(currentSkip, LIMIT);
      
      if (reset) {
        setAnnouncements(data);
      } else {
        setAnnouncements(prev => [...prev, ...data]);
      }
      
      setHasMore(data.length === LIMIT);
    } catch (err) {
      showApiError(err, 'Failed to fetch announcements.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
      setIsLoadingMore(false);
    }
  }, [showApiError, announcements.length]);

  // Initial load
  useEffect(() => {
    // Only load if empty and not loading to prevent double fetch on mount
    if (announcements.length === 0 && hasMore) {
        fetchAnnouncements(false, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOpenCreate = () => {
    setEditingAnnouncement(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setIsModalOpen(true);
  };

  const handleSubmit = async (title: string, content: string, videoLinks: string[]) => {
    setIsSubmitting(true);
    try {
      if (editingAnnouncement) {
        await announcementService.updateAnnouncement(editingAnnouncement.id, title, content, videoLinks);
        showSuccess('Announcement updated successfully', 'Success');
      } else {
        await announcementService.createAnnouncement(title, content, videoLinks);
        showSuccess('Announcement published successfully', 'Success');
      }
      setIsModalOpen(false);
      fetchAnnouncements(true, true);
    } catch (err) {
      showApiError(err, editingAnnouncement ? 'Failed to update announcement' : 'Failed to publish announcement');
    } finally {
      setIsSubmitting(false);
    }
  };

  const triggerDelete = (id: string) => {
    setAnnouncementToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!announcementToDelete) return;
    setIsDeleting(true);
    try {
      await announcementService.deleteAnnouncement(announcementToDelete);
      showSuccess('Announcement deleted successfully', 'Success');
      setDeleteModalOpen(false);
      setAnnouncementToDelete(null);
      fetchAnnouncements(true, true);
    } catch (err) {
      showApiError(err, 'Failed to delete announcement');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 pb-20 pt-8 sm:pt-12 px-4 sm:px-6">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-[0.1em] uppercase flex items-center">
            <Radio className="w-6 h-6 mr-3 text-blue-400 animate-pulse" />
            Announcements
          </h2>
          <p className="text-sm text-gray-400 mt-2">
            Stay updated with the latest news, updates, and releases from the DextroSage team.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchAnnouncements(true, true)}
            disabled={isLoading || isRefreshing}
            isLoading={isRefreshing}
          >
            {!isRefreshing && <RefreshCw className="w-4 h-4 mr-2" />}
            Refresh Feed
          </Button>
        </div>
      </div>

      {/* Create Announcement Inline Box (Admins only) */}
      {isAdminOrSadmin && (
        <div 
          onClick={handleOpenCreate}
          className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-4 sm:p-6 flex items-center space-x-4 cursor-text transition-all duration-300 hover:border-white/20 hover:bg-white/10"
        >
          <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center shrink-0">
            <PlusCircle className="w-5 h-5 text-blue-400" />
          </div>
          <div className="flex-grow bg-black/20 border border-white/5 rounded-full py-3 px-6 text-gray-400 text-sm font-medium">
            Start a new announcement...
          </div>
        </div>
      )}

      {/* Feed */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="py-24">
            <Loader size="lg" text="Loading announcements feed..." />
          </div>
        ) : announcements.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white/5 border border-white/10 rounded-2xl text-center backdrop-blur-sm">
            <Radio className="w-12 h-12 text-gray-500 mb-4 opacity-50" />
            <h3 className="text-lg font-semibold text-white">No announcements yet</h3>
            <p className="text-sm text-gray-400 mt-2 max-w-sm">
              Check back later for updates, news, and official statements from the team.
            </p>
          </div>
        ) : (
          announcements.map((announcement) => (
            <AnnouncementCard
              key={announcement.id}
              announcement={announcement}
              onEdit={handleOpenEdit}
              onDelete={triggerDelete}
            />
          ))
        )}
        
        {/* Load More Button */}
        {announcements.length > 0 && hasMore && (
          <div className="flex justify-center pt-4 pb-8">
            <Button
              variant="outline"
              onClick={() => fetchAnnouncements()}
              disabled={isLoadingMore}
              isLoading={isLoadingMore}
            >
              Load More
            </Button>
          </div>
        )}
      </div>

      {/* Modals */}
      {isAdminOrSadmin && (
        <>
          <AnnouncementModal
            isOpen={isModalOpen}
            onClose={() => !isSubmitting && setIsModalOpen(false)}
            onSubmit={handleSubmit}
            initialData={editingAnnouncement}
            isLoading={isSubmitting}
          />

          <Modal
            isOpen={deleteModalOpen}
            onClose={() => !isDeleting && setDeleteModalOpen(false)}
            title="Delete Announcement?"
            confirmText="Delete"
            onConfirm={confirmDelete}
            isLoading={isDeleting}
            variant="danger"
          >
            <p className="text-sm text-gray-400">
              Are you sure you want to permanently delete this announcement? 
              This action cannot be undone and it will be immediately removed from the feed for all users.
            </p>
          </Modal>
        </>
      )}

    </div>
  );
};
