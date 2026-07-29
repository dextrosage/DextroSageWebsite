import React, { useState, useEffect } from 'react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import type { Announcement } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, content: string) => Promise<void>;
  initialData?: Announcement | null;
  isLoading?: boolean;
}

export const AnnouncementModal: React.FC<Props> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData, 
  isLoading 
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setTitle(initialData.title);
        setContent(initialData.content);
      } else {
        setTitle('');
        setContent('');
      }
    }
  }, [isOpen, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    await onSubmit(title.trim(), content.trim());
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Announcement" : "Create Announcement"}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
            Announcement Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-lg focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 block p-3 transition-colors outline-none"
            placeholder="e.g. Major platform update rolling out today"
            required
            maxLength={200}
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
            Detailed Content
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-lg focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 block p-3 transition-colors outline-none min-h-[250px] resize-y"
            placeholder="Type your announcement content here... You can use multiple lines and spacing."
            required
            maxLength={50000}
            disabled={isLoading}
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-white/10">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            disabled={!title.trim() || !content.trim() || isLoading}
          >
            {initialData ? 'Save Changes' : 'Post Announcement'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
