import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { superAdminService } from '../../services/superAdminService';
import { useToast } from '../../contexts/ToastContext';
import type { Session } from '../../types';
import { SessionCard } from '../../components/SessionCard';
import { Loader } from '../../components/ui/Loader';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { ArrowLeft, Key, RefreshCw, Trash2 } from 'lucide-react';

export const SuperAdminMemberSessions: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { showSuccess, showApiError } = useToast();
  const { decodedTokenInfo } = useAuth();

  const [sessions, setSessions] = useState<Session[]>([]);
  const [memberName, setMemberName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Deletion States
  const [deleteSessionModal, setDeleteSessionModal] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);
  const [isDeletingSession, setIsDeletingSession] = useState(false);

  const [deleteAllModal, setDeleteAllModal] = useState(false);
  const [isDeletingAll, setIsDeletingAll] = useState(false);

  const fetchSessionData = useCallback(async (quiet = false) => {
    if (!userId) return;
    if (!quiet) setIsLoading(true);
    else setIsRefreshing(true);

    try {
      // 1. Fetch sessions
      const sessionList = await superAdminService.getMemberSessions(userId);
      setSessions(sessionList);

      // 2. Fetch member list to lookup user name
      const memberList = await superAdminService.getMembers();
      const member = memberList.find(m => m.user_id === userId);
      if (member) {
        setMemberName(member.name);
      } else {
        setMemberName('Unknown User');
      }
    } catch (err) {
      showApiError(err, 'Failed to fetch session records for this member.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [userId, showApiError]);

  useEffect(() => {
    fetchSessionData();
  }, [fetchSessionData]);

  // Handle single session deletion
  const triggerDeleteSession = (sessionId: string) => {
    setSessionToDelete(sessionId);
    setDeleteSessionModal(true);
  };

  const handleDeleteSessionConfirm = async () => {
    if (!sessionToDelete) return;
    setIsDeletingSession(true);
    try {
      await superAdminService.deleteSession(sessionToDelete);
      showSuccess('The selected active login session has been invalidated.', 'Session Deleted');
      setDeleteSessionModal(false);
      setSessionToDelete(null);
      // Reload
      fetchSessionData(true);
    } catch (err) {
      showApiError(err, 'Failed to terminate session.');
    } finally {
      setIsDeletingSession(false);
    }
  };

  // Handle delete all sessions
  const handleDeleteAllConfirm = async () => {
    if (!userId) return;
    setIsDeletingAll(true);
    try {
      await superAdminService.deleteAllSessions(userId);
      showSuccess(`All active login sessions for ${memberName || 'this user'} have been revoked.`, 'Sessions Purged');
      setDeleteAllModal(false);
      // Reload
      fetchSessionData(true);
    } catch (err) {
      showApiError(err, 'Failed to terminate all sessions.');
    } finally {
      setIsDeletingAll(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Back to dashboard & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <button
            onClick={() => navigate('/sadmin')}
            className="inline-flex items-center text-xs font-semibold text-gray-400 hover:text-white transition-colors uppercase tracking-wide mb-2 focus:outline-none"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            Back to members
          </button>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Active Sessions
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Displaying all active device logins for <strong className="text-gray-300">{memberName || userId}</strong>
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchSessionData(true)}
            disabled={isLoading || isRefreshing}
            isLoading={isRefreshing}
          >
            {!isRefreshing && <RefreshCw className="w-3.5 h-3.5 mr-1.5" />}
            Refresh
          </Button>
          {sessions.length > 0 && (
            <Button
              variant="danger"
              size="sm"
              onClick={() => setDeleteAllModal(true)}
              disabled={isLoading}
            >
              <Trash2 className="w-4 h-4 mr-1.5" />
              Terminate All Sessions
            </Button>
          )}
        </div>
      </div>

      {/* Sessions Grid */}
      {isLoading ? (
        <div className="py-24">
          <Loader size="lg" text="Fetching active session tokens..." />
        </div>
      ) : sessions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white/5 border border-white/10 rounded-xl p-8 text-center shadow-sm backdrop-blur-sm">
          <Key className="w-12 h-12 text-gray-500 mb-3" />
          <h3 className="text-sm font-semibold text-gray-300">No active sessions</h3>
          <p className="text-xs text-gray-400 mt-1">
            This user does not have any active tokens in the database.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sessions
            .filter((session) => session.session_id !== decodedTokenInfo?.session_id)
            .map((session) => (
              <SessionCard
                key={session.session_id}
                session={session}
                onDelete={() => triggerDeleteSession(session.session_id)}
              />
            ))}
        </div>
      )}

      {/* Confirmation single delete */}
      <Modal
        isOpen={deleteSessionModal}
        onClose={() => !isDeletingSession && setDeleteSessionModal(false)}
        title="Revoke User Session?"
        confirmText="Revoke Session"
        onConfirm={handleDeleteSessionConfirm}
        isLoading={isDeletingSession}
        variant="danger"
      >
        <p className="text-sm text-gray-400">
          Are you sure you want to terminate this specific login session?
          The user on the corresponding device will be immediately logged out and forced to re-authenticate on their next request.
        </p>
        {sessionToDelete && (
          <div className="mt-3 p-2 bg-black/40 border border-white/10 rounded font-mono text-xxs text-gray-400 break-all">
            Session ID: {sessionToDelete}
          </div>
        )}
      </Modal>

      {/* Confirmation bulk delete */}
      <Modal
        isOpen={deleteAllModal}
        onClose={() => !isDeletingAll && setDeleteAllModal(false)}
        title="Revoke ALL Active Sessions?"
        confirmText="Revoke All"
        onConfirm={handleDeleteAllConfirm}
        isLoading={isDeletingAll}
        variant="danger"
      >
        <p className="text-sm text-gray-400">
          Are you sure you want to terminate <strong className="text-white">every single active login session</strong> for <strong className="text-white">{memberName || 'this user'}</strong>?
          This will log out the user from all devices currently connected to this account.
        </p>
      </Modal>
    </div>
  );
};
