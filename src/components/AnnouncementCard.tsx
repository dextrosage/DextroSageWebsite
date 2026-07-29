import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Edit, Trash2, Megaphone } from 'lucide-react';
import type { Announcement } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface Props {
  announcement: Announcement;
  onEdit: (announcement: Announcement) => void;
  onDelete: (id: string) => void;
}

export const AnnouncementCard: React.FC<Props> = ({ announcement, onEdit, onDelete }) => {
  const { role } = useAuth();
  
  // Can only edit if ADMIN or SADMIN. 
  // We assume role is checked securely in backend, but frontend hides buttons.
  const isAdminOrSadmin = role === 'ADMIN' || role === 'SADMIN';

  return (
    <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl overflow-hidden shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] transition-all duration-300 hover:border-white/20">
      <div className="p-6 sm:p-8">
        
        {/* Header: Author & Time & Controls */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center">
              <Megaphone className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-white font-bold tracking-wide">
                {announcement.author_name}
              </h3>
              <div className="flex items-center space-x-2 text-xs">
                <span className="text-blue-400 font-semibold uppercase tracking-wider">{announcement.author_role}</span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-400">
                  {formatDistanceToNow(new Date(announcement.created_at), { addSuffix: true })}
                </span>
              </div>
            </div>
          </div>
          
          {isAdminOrSadmin && (
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => onEdit(announcement)}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                title="Edit Announcement"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button 
                onClick={() => onDelete(announcement.id)}
                className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-full transition-colors"
                title="Delete Announcement"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 leading-tight tracking-tight">
            {announcement.title}
          </h2>
          <div className="text-gray-300 whitespace-pre-wrap break-words text-sm sm:text-base leading-relaxed">
            {announcement.content}
          </div>
        </div>

      </div>
    </div>
  );
};
