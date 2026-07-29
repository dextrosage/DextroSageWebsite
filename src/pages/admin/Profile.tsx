import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { adminService } from '../../services/adminService';
import type { Session } from '../../types';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { SessionCard } from '../../components/SessionCard';
import { Loader } from '../../components/ui/Loader';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { DeveloperProfileView } from '../../components/DeveloperProfileView';
import { Shield, Mail, Phone, Trash2, Key } from 'lucide-react';

export const AdminProfile: React.FC = () => {
  const { user, logout, decodedTokenInfo } = useAuth();
  const { showSuccess, showApiError } = useToast();

  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);

  // Developer Profile view states
  const [profileData, setProfileData] = useState<any>(null);
  const [showDevProfile, setShowDevProfile] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  // Deletion Modals & Loading States
  const [deleteSessionModal, setDeleteSessionModal] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);
  const [isDeletingSession, setIsDeletingSession] = useState(false);

  const [deleteAllModal, setDeleteAllModal] = useState(false);
  const [isDeletingAll, setIsDeletingAll] = useState(false);

  const [deleteAccountModal, setDeleteAccountModal] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  // Fetch active sessions for the current admin
  const fetchSessions = useCallback(async (quiet = false) => {
    if (!decodedTokenInfo?.sub) return;
    if (!quiet) setIsLoadingSessions(true);

    try {
      const data = await adminService.getOwnSessions();
      setSessions(data);
    } catch (err) {
      showApiError(err, 'Failed to fetch session list.');
    } finally {
      setIsLoadingSessions(false);
    }
  }, [decodedTokenInfo, showApiError]);

  const handleViewDeveloperProfile = async () => {
    setIsLoadingProfile(true);
    try {
      const data = await adminService.getProfile();
      setProfileData(data);
      setShowDevProfile(true);
    } catch (err) {
      showApiError(err, 'Failed to fetch developer profile.');
    } finally {
      setIsLoadingProfile(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);





  // Handle Delete Single Session
  const triggerDeleteSession = (sessionId: string) => {
    setSessionToDelete(sessionId);
    setDeleteSessionModal(true);
  };

  const handleDeleteSessionConfirm = async () => {
    if (!sessionToDelete) return;
    setIsDeletingSession(true);
    try {
      await adminService.deleteSession(sessionToDelete);
      showSuccess('Selected session revoked successfully.', 'Session Deleted');
      setDeleteSessionModal(false);

      if (decodedTokenInfo && sessionToDelete === decodedTokenInfo.session_id) {
        showSuccess('Active admin session terminated. Signing out...', 'Session Revoked');
        await logout();
        return;
      }

      setSessionToDelete(null);
      // Reload sessions
      fetchSessions(true);
    } catch (err) {
      showApiError(err, 'Failed to revoke session.');
    } finally {
      setIsDeletingSession(false);
    }
  };

  // Handle Delete All Sessions
  const handleDeleteAllConfirm = async () => {
    if (!decodedTokenInfo?.sub) return;
    setIsDeletingAll(true);
    try {
      await adminService.deleteAllSessions();
      showSuccess('All admin active sessions revoked. Signing out...', 'Sessions Purged');
      setDeleteAllModal(false);
      // Since all sessions (including current one) are deleted, trigger logout
      await logout();
    } catch (err) {
      showApiError(err, 'Failed to revoke all sessions.');
      setIsDeletingAll(false);
    }
  };

  // Handle Delete Own Account
  const handleDeleteAccountConfirm = async () => {
    setIsDeletingAccount(true);
    try {
      await adminService.deleteMember();
      showSuccess('Your administrator account has been deleted.', 'Account Deleted');
      setDeleteAccountModal(false);
      await logout();
    } catch (err) {
      showApiError(err, 'Failed to delete account.');
      setIsDeletingAccount(false);
    }
  };





  if (showDevProfile && profileData) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-white tracking-[0.1em] uppercase">My Developer Profile</h2>
          <p className="text-xs text-gray-400 mt-1">
            Your registered developer profile details, qualifications, and history.
          </p>
        </div>
        <DeveloperProfileView
          profile={profileData}
          userName={user?.name}
          userEmail={user?.email}
          onBack={() => setShowDevProfile(false)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h2 className="text-xl font-bold text-white tracking-[0.1em] uppercase">Admin Profile</h2>
        <p className="text-xs text-gray-400 mt-1">
          Review your administrator details and manage active login sessions.
        </p>
      </div>

      <div className="space-y-6">
        {/* Left Columns: Admin info & active sessions */}
        <div className="space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white tracking-wide uppercase">Personal Information</h3>
                  <p className="text-xxs text-gray-400">Admin Account</p>
                </div>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={handleViewDeveloperProfile}
                isLoading={isLoadingProfile}
              >
                View Developer Profile
              </Button>
            </CardHeader>
            <CardBody className="divide-y divide-white/5 p-0">
              <div className="px-5 py-4 flex items-center justify-between">
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Full Name</span>
                <span className="text-sm font-semibold text-white">{user?.name || 'Loading...'}</span>
              </div>
              <div className="px-5 py-4 flex items-center justify-between">
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Email Address</span>
                <div className="flex items-center space-x-1.5">
                  <Mail className="w-3.5 h-3.5 text-gray-500" />
                  <span className="text-sm font-medium text-white">{user?.email || 'N/A'}</span>
                </div>
              </div>
              <div className="px-5 py-4 flex items-center justify-between">
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Phone Number</span>
                <div className="flex items-center space-x-1.5">
                  <Phone className="w-3.5 h-3.5 text-gray-500" />
                  <span className="text-sm font-medium text-white">{user?.phno || 'Not Registered'}</span>
                </div>
              </div>
              <div className="px-5 py-4 flex items-center justify-between">
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Account Role</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {user?.role || 'ADMIN'}
                </span>
              </div>
            </CardBody>
          </Card>

          {/* Sessions Management */}
          <Card>
            <CardHeader className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/5 text-gray-400 border border-white/10 rounded-lg">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white tracking-wide uppercase">Active Admin Sessions</h3>
                  <p className="text-xxs text-gray-400">Security diagnostics (admin endpoint)</p>
                </div>
              </div>
              {sessions.length > 1 && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setDeleteAllModal(true)}
                  disabled={isLoadingSessions}
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1" />
                  Terminate All Sessions
                </Button>
              )}
            </CardHeader>
            <CardBody className="space-y-4">
              {isLoadingSessions ? (
                <div className="py-12">
                  <Loader size="md" text="Loading sessions..." />
                </div>
              ) : sessions.filter((s) => s.session_id !== decodedTokenInfo?.session_id).length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-xs">
                  No other active sessions.
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
            </CardBody>
          </Card>

          {/* Logout & Delete Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              variant="danger"
              onClick={() => setDeleteAccountModal(true)}
              disabled={isDeletingAccount}
              className="w-full sm:w-auto px-6"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete My Account
            </Button>
          </div>
        </div>
      </div>

      {/* Confirmation Modals */}
      {/* Delete session */}
      <Modal
        isOpen={deleteSessionModal}
        onClose={() => !isDeletingSession && setDeleteSessionModal(false)}
        title="Revoke Device Session?"
        confirmText="Revoke Session"
        onConfirm={handleDeleteSessionConfirm}
        isLoading={isDeletingSession}
        variant="danger"
      >
        <p className="text-sm text-gray-400">
          Are you sure you want to terminate this specific administrator login session?
          If you revoke your active session, you will be immediately signed out.
        </p>
      </Modal>

      {/* Delete all sessions */}
      <Modal
        isOpen={deleteAllModal}
        onClose={() => !isDeletingAll && setDeleteAllModal(false)}
        title="Terminate All Active Sessions?"
        confirmText="Terminate All"
        onConfirm={handleDeleteAllConfirm}
        isLoading={isDeletingAll}
        variant="danger"
      >
        <p className="text-sm text-gray-400">
          Are you sure you want to terminate <strong className="text-white">every single active login session</strong>?
          This includes your current administrator session, and you will be signed out immediately.
        </p>
      </Modal>

      {/* Delete own account */}
      <Modal
        isOpen={deleteAccountModal}
        onClose={() => !isDeletingAccount && setDeleteAccountModal(false)}
        title="Delete Your Admin Account?"
        confirmText="Delete Account"
        onConfirm={handleDeleteAccountConfirm}
        isLoading={isDeletingAccount}
        variant="danger"
      >
        <p className="text-sm text-gray-400">
          Are you sure you want to permanently delete your <strong className="text-white">Admin</strong> account?
          This will delete your credentials, profile details, and terminate all active sessions. This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
};
