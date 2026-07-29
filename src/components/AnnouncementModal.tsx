import React, { useState, useEffect } from 'react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import type { Announcement } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, content: string, videoLinks: string[]) => Promise<void>;
  initialData?: Announcement | null;
  isLoading?: boolean;
}

const getEmbedUrl = (url: string): string => {
  if (!url) return '';
  
  // Extract src URL if full iframe HTML tag is pasted
  if (url.includes('<iframe')) {
    const srcMatch = url.match(/src=["']([^"']+)["']/);
    if (srcMatch && srcMatch[1]) {
      url = srcMatch[1];
    }
  }

  if (url.includes('youtube.com/embed/')) return url;
  
  let videoId = '';
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) {
    videoId = match[2];
  }
  
  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}`;
  }
  return url;
};

export const AnnouncementModal: React.FC<Props> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData, 
  isLoading 
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [videoLinks, setVideoLinks] = useState<string[]>([]);
  const [newLink, setNewLink] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setTitle(initialData.title);
        setContent(initialData.content);
        setVideoLinks(initialData.video_links || []);
      } else {
        setTitle('');
        setContent('');
        setVideoLinks([]);
      }
      setNewLink('');
    }
  }, [isOpen, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    await onSubmit(title.trim(), content.trim(), videoLinks);
  };

  const handleAddLink = () => {
    if (!newLink.trim()) return;
    const embedUrl = getEmbedUrl(newLink.trim());
    if (embedUrl && !videoLinks.includes(embedUrl)) {
      setVideoLinks([...videoLinks, embedUrl]);
    }
    setNewLink('');
  };

  const handleRemoveLink = (index: number) => {
    setVideoLinks(videoLinks.filter((_, i) => i !== index));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Announcement" : "Create Announcement"}
      showFooter={false}
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
            YouTube Video Links
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              value={newLink}
              onChange={(e) => setNewLink(e.target.value)}
              className="flex-grow bg-white/5 border border-white/10 text-white text-sm rounded-lg focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 block p-3 transition-colors outline-none"
              placeholder="e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ"
              disabled={isLoading}
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleAddLink}
              disabled={!newLink.trim() || isLoading}
            >
              Add Link
            </Button>
          </div>
          {videoLinks.length > 0 && (
            <div className="mt-3 space-y-2 max-h-32 overflow-y-auto bg-black/20 border border-white/5 rounded-lg p-2">
              {videoLinks.map((link, idx) => (
                <div key={idx} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-md px-3 py-1.5 text-xs text-blue-400 font-mono">
                  <span className="truncate max-w-[260px]" title={link}>{link}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveLink(idx)}
                    className="text-red-400 hover:text-red-300 transition-colors ml-2 font-sans font-bold"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
            Detailed Content
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-white/5 border border-white/10 text-white text-sm rounded-lg focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500/50 block p-3 transition-colors outline-none min-h-[200px] resize-y"
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
