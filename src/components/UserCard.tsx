import React, { useState } from 'react';
import type { User } from '../types';
import { Card, CardBody, CardFooter } from './ui/Card';
import { Button } from './ui/Button';
import { User as UserIcon, Mail, Phone, Shield, MessageSquare, UserPlus, Check, Clock, XCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { ChatModal } from './ChatModal';

interface UserCardProps {
  user: User;
  onViewSessions?: () => void;
  onDelete?: () => void;
  onClick?: () => void;
  isDeleting?: boolean;
}

export const UserCard: React.FC<UserCardProps> = ({
  user,
  onViewSessions,
  onDelete,
  onClick,
  isDeleting = false,
}) => {
  const isAdmin = user.role === 'ADMIN';
  const { user: currentUser, refreshProfile } = useAuth();
  const [isActioning, setIsActioning] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Connection states
  const isConnected = currentUser?.connected_users?.includes(user.user_id) || false;
  const hasSentRequest = currentUser?.sent_requests?.includes(user.user_id) || false;
  const hasPendingRequest = currentUser?.pending_connections?.includes(user.user_id) || false;
  const isSelf = currentUser?.user_id === user.user_id;

  const handleConnect = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser) return;
    setIsActioning(true);
    try {
      await api.post(`/user/connect/${user.user_id}`);
      await refreshProfile();
    } catch (err) {
      console.error('Failed to connect:', err);
    } finally {
      setIsActioning(false);
    }
  };

  const handleAccept = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsActioning(true);
    try {
      await api.post(`/user/connect/${user.user_id}/accept`);
      await refreshProfile();
    } catch (err) {
      console.error('Failed to accept:', err);
    } finally {
      setIsActioning(false);
    }
  };

  const handleDecline = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsActioning(true);
    try {
      await api.post(`/user/connect/${user.user_id}/reject`);
      await refreshProfile();
    } catch (err) {
      console.error('Failed to decline:', err);
    } finally {
      setIsActioning(false);
    }
  };

  const handleRemove = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsActioning(true);
    try {
      await api.post(`/user/connect/${user.user_id}/remove`);
      await refreshProfile();
    } catch (err) {
      console.error('Failed to remove connection:', err);
    } finally {
      setIsActioning(false);
    }
  };

  const handleChat = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsChatOpen(true);
  };

  return (
    <>
      <Card
        hoverable
        className={`overflow-hidden bg-[#020617]/60 backdrop-blur-md border border-white/10 ${onClick ? 'cursor-pointer transition-all hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] hover:border-blue-500/50' : ''}`}
        onClick={onClick}
      >
        <CardBody className="space-y-4 relative">
          {/* Connection Badges */}
          {isConnected && !isSelf && (
            <div className="absolute top-4 right-4 bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-0.5 rounded text-[10px] font-bold uppercase flex items-center gap-1">
              <Check className="w-3 h-3" /> Connected
            </div>
          )}
          {hasSentRequest && !isSelf && (
            <div className="absolute top-4 right-4 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-2 py-0.5 rounded text-[10px] font-bold uppercase flex items-center gap-1">
              <Clock className="w-3 h-3" /> Pending
            </div>
          )}

          {/* Header Block */}
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${isAdmin ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'}`}>
              {isAdmin ? <Shield className="w-5 h-5" /> : <UserIcon className="w-5 h-5" />}
            </div>
            <div className="pr-16">
              <h4 className="text-sm font-semibold text-white line-clamp-1">{user.name}</h4>
              <span
                className={`inline-flex items-center px-2 py-0.5 mt-0.5 rounded text-xxs font-bold tracking-wider uppercase ${
                  isAdmin ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-500/20 text-blue-300'
                }`}
              >
                {user.role}
              </span>
            </div>
          </div>

          {/* Fields */}
          <div className="space-y-2 text-xs text-gray-400">
            <div className="flex items-center space-x-2">
              <Mail className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
              <span className="truncate" title={user.email}>{user.email}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
              <span>{user.phno || 'Not Registered'}</span>
            </div>
          </div>
        </CardBody>

        {/* Footer Actions */}
        <CardFooter className="flex items-center gap-2 pt-3 pb-3 border-t border-white/5 bg-black/20">
          {!isSelf && (
            <>
              {isConnected && (
                <div className="flex w-full gap-2">
                  <Button variant="primary" size="sm" className="flex-1 text-xs" onClick={handleChat}>
                    <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
                    Chat
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 text-xs text-red-400 border-red-500/30 hover:bg-red-500/10" onClick={handleRemove} isLoading={isActioning}>
                    <XCircle className="w-3.5 h-3.5 mr-1.5" />
                    Disconnect
                  </Button>
                </div>
              )}
              {hasSentRequest && (
                <Button variant="outline" size="sm" className="flex-1 text-xs text-yellow-400 border-yellow-500/30" disabled>
                  <Clock className="w-3.5 h-3.5 mr-1.5" />
                  Requested
                </Button>
              )}
              {hasPendingRequest && (
                <div className="flex w-full gap-2">
                  <Button variant="primary" size="sm" className="flex-1 text-xs" onClick={handleAccept} isLoading={isActioning}>
                    <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
                    Accept
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={handleDecline} isLoading={isActioning}>
                    <XCircle className="w-3.5 h-3.5 mr-1.5" />
                    Decline
                  </Button>
                </div>
              )}
              {!isConnected && !hasSentRequest && !hasPendingRequest && (
                <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={handleConnect} isLoading={isActioning}>
                  <UserPlus className="w-3.5 h-3.5 mr-1.5" />
                  Connect
                </Button>
              )}
            </>
          )}

          {onViewSessions && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-xs"
              onClick={(e) => {
                e.stopPropagation();
                onViewSessions();
              }}
            >
              Sessions
            </Button>
          )}
          {onDelete && (
            <Button
              variant="danger"
              size="sm"
              className="flex-1 text-xs"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              isLoading={isDeleting}
            >
              Delete
            </Button>
          )}
        </CardFooter>
      </Card>

      <ChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        targetUser={user}
        currentUser={currentUser}
      />
    </>
  );
};
