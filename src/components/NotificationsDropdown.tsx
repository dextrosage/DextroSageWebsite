import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export interface Notification {
  _id: string;
  user_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

export const NotificationsDropdown: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetchNotifications = async () => {
      try {
        const res = await api.get('/user/notifications');
        setNotifications(res.data);
      } catch (err) {
        console.error('Failed to fetch notifications', err);
      }
    };
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000); // poll every 10s
    return () => clearInterval(interval);
  }, [user, isOpen, location.pathname]); // refresh when opened or when tab changes

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleMarkAsRead = async () => {
    if (unreadCount === 0) return;
    try {
      await api.post('/user/notifications/mark-read');
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (err) {
      console.error('Failed to mark notifications read', err);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen && unreadCount > 0) {
            handleMarkAsRead();
          }
        }}
        className="relative p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors focus:outline-none"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-[#020617]"></span>
        )}
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-80 bg-[#020617] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden animate-fade-in backdrop-blur-xl">
            <div className="px-4 py-3 border-b border-white/5 bg-black/40 flex justify-between items-center">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Notifications</h3>
              <CheckCircle className="w-4 h-4 text-gray-500" />
            </div>
            <div className="max-h-96 overflow-y-auto p-2">
              {notifications.length === 0 ? (
                <div className="px-4 py-6 text-center text-xs text-gray-500">
                  You have no new notifications.
                </div>
              ) : (
                notifications.map((n, idx) => (
                  <div 
                    key={n._id || idx} 
                    className={`p-3 rounded-lg text-sm mb-1 ${!n.is_read ? 'bg-blue-500/10' : 'hover:bg-white/5'}`}
                  >
                    <p className={`text-gray-200 ${!n.is_read ? 'font-semibold text-white' : ''}`}>
                      {n.content}
                    </p>
                    <span className="text-[10px] text-gray-500 mt-1 block">
                      {new Date(n.created_at).toLocaleString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
