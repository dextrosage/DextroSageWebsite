import React, { useEffect, useState, useCallback } from 'react';
import { api } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';
import type { User } from '../../types';
import { UserCard } from '../../components/UserCard';
import { Loader } from '../../components/ui/Loader';
import { Users, Clock, CheckCircle } from 'lucide-react';

export const Connections: React.FC = () => {
  const { showApiError } = useToast();

  const [connectedUsers, setConnectedUsers] = useState<User[]>([]);
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchConnections = useCallback(async () => {
    setIsLoading(true);
    try {
      const [connRes, pendRes] = await Promise.all([
        api.get('/user/connections'),
        api.get('/user/pending_connections')
      ]);
      setConnectedUsers(connRes.data);
      setPendingUsers(pendRes.data);
    } catch (err) {
      showApiError(err, 'Failed to fetch connections.');
    } finally {
      setIsLoading(false);
    }
  }, [showApiError]);

  useEffect(() => {
    fetchConnections();
    // Poll occasionally to see updates if we stay on this page
    const interval = setInterval(fetchConnections, 15000);
    return () => clearInterval(interval);
  }, [fetchConnections]);

  if (isLoading && connectedUsers.length === 0 && pendingUsers.length === 0) {
    return (
      <div className="py-24">
        <Loader size="lg" text="Loading connections..." />
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white tracking-[0.1em] uppercase flex items-center space-x-2">
          <Users className="w-5 h-5 text-blue-400" />
          <span>My Network</span>
        </h2>
        <p className="text-xs text-gray-400 mt-1">
          Manage your connections and chat with your network.
        </p>
      </div>

      {/* Pending Connections Section */}
      {pendingUsers.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2 border-b border-white/10 pb-2">
            <Clock className="w-4 h-4 text-yellow-400" />
            Pending Requests ({pendingUsers.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {pendingUsers.map(u => (
              <UserCard key={u.user_id} user={u} />
            ))}
          </div>
        </div>
      )}

      {/* Connected Users Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2 border-b border-white/10 pb-2">
          <CheckCircle className="w-4 h-4 text-green-400" />
          My Connections ({connectedUsers.length})
        </h3>
        {connectedUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-white/5 border border-white/10 rounded-xl text-center">
            <Users className="w-12 h-12 text-gray-600 mb-3" />
            <p className="text-sm text-gray-400">You don't have any connections yet.</p>
            <p className="text-xs text-gray-500 mt-1">Go to the Members Directory to connect with people.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {connectedUsers.map(u => (
              <UserCard key={u.user_id} user={u} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
