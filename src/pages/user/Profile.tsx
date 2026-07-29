import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { userService } from '../../services/userService';
import type { Session } from '../../types';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { SessionCard } from '../../components/SessionCard';
import { Loader } from '../../components/ui/Loader';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { DeveloperProfileView } from '../../components/DeveloperProfileView';
import { User, Mail, Phone, Key, ShieldAlert, Trash2, LogOut, UserX } from 'lucide-react';

export const UserProfile: React.FC = () => {
  const { user, logout, decodedTokenInfo } = useAuth();
  const { showSuccess, showApiError } = useToast();

  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);

  // Developer Profile view states
  const [profileData, setProfileData] = useState<any>(null);
  const [showDevProfile, setShowDevProfile] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  // Loading States for Actions
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  // Deletion Modals & Loading States
  const [deleteSessionModal, setDeleteSessionModal] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);
  const [isDeletingSession, setIsDeletingSession] = useState(false);

  const [deleteAllModal, setDeleteAllModal] = useState(false);
  const [isDeletingAll, setIsDeletingAll] = useState(false);

  const [deleteAccountModal, setDeleteAccountModal] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  // Fetch session data
  const fetchSessions = useCallback(async (quiet = false) => {
    if (!quiet) setIsLoadingSessions(true);

    try {
      const data = await userService.getSessions();
      setSessions(data);
    } catch (err) {
      showApiError(err, 'Failed to fetch session list.');
    } finally {
      setIsLoadingSessions(false);
    }
  }, [showApiError]);

  const handleViewDeveloperProfile = async () => {
    setIsLoadingProfile(true);
    try {
      const data = await userService.getProfile();
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



  // Handle Logout
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Handle Delete Single Session
  const triggerDeleteSession = (sessionId: string) => {
    setSessionToDelete(sessionId);
    setDeleteSessionModal(true);
  };

  const handleDeleteSessionConfirm = async () => {
    if (!sessionToDelete) return;
    setIsDeletingSession(true);
    try {
      await userService.deleteSession(sessionToDelete);
      showSuccess('Selected session revoked successfully.', 'Session Deleted');
      setDeleteSessionModal(false);
      
      if (decodedTokenInfo && sessionToDelete === decodedTokenInfo.session_id) {
        showSuccess('Active session terminated. Signing out...', 'Session Revoked');
        await logout();
        return;
      }
      
      setSessionToDelete(null);
      // Reload
      fetchSessions(true);
    } catch (err) {
      showApiError(err, 'Failed to revoke session.');
    } finally {
      setIsDeletingSession(false);
    }
  };

  // Handle Delete All Sessions
  const handleDeleteAllConfirm = async () => {
    setIsDeletingAll(true);
    try {
      await userService.deleteAllSessions();
      showSuccess('All active login sessions terminated. Signing out...', 'Sessions Purged');
      setDeleteAllModal(false);
      await logout();
    } catch (err) {
      showApiError(err, 'Failed to revoke all sessions.');
    } finally {
      setIsDeletingAll(false);
    }
  };

  // Handle Delete Account
  const handleDeleteAccountConfirm = async () => {
    setIsDeletingAccount(true);
    try {
      await userService.deleteAccount();
      showSuccess('Your account and all associate data has been permanently deleted.', 'Account Deleted');
      setDeleteAccountModal(false);
      // Trigger logout script to clear storage and push to login
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
        <h2 className="text-xl font-bold text-white tracking-[0.1em] uppercase">Profile & Sessions</h2>
        <p className="text-xs text-gray-400 mt-1">
          Manage your account profile, active login sessions, and diagnostic JWT tokens.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Columns: Profile details and Sessions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Card */}
          <Card>
            <CardHeader className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white tracking-wide uppercase">Personal Information</h3>
                  <p className="text-xxs text-gray-400">Account Details</p>
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
                  {user?.role || 'USER'}
                </span>
              </div>
            </CardBody>
          </Card>

          {/* Session Manager Card */}
          <Card>
            <CardHeader className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/5 text-gray-400 border border-white/10 rounded-lg">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white tracking-wide uppercase">Active Login Sessions</h3>
                  <p className="text-xxs text-gray-400">Security diagnostics</p>
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

          {/* Danger zone actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              variant="outline"
              onClick={handleLogout}
              isLoading={isLoggingOut}
              className="flex-1"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
            <Button
              variant="danger"
              onClick={() => setDeleteAccountModal(true)}
              disabled={isLoggingOut}
              className="flex-1"
            >
              <UserX className="w-4 h-4 mr-2" />
              Delete My Account
            </Button>
          </div>
        </div>

        {/* Right Column: JWT Info */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                <Key className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white tracking-wide uppercase">JWT Diagnostics</h3>
                <p className="text-xxs text-gray-400">Current Access Token</p>
              </div>
            </CardHeader>
            <CardBody className="space-y-5">
              {/* Token Status */}
              <div>
                <span className="text-xxs font-bold text-gray-500 uppercase tracking-widest block mb-1">
                  Token Status
                </span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xxs font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30`}>
                  Active & Verified
                </span>
              </div>



              {/* Session ID */}
              <div>
                <span className="text-xxs font-bold text-gray-500 uppercase tracking-widest block mb-1 flex items-center">
                  <ShieldAlert className="w-3 h-3 mr-1 text-gray-500" />
                  Current Session ID
                </span>
                <span className="text-xs font-mono text-gray-400 break-all leading-tight block">
                  {decodedTokenInfo?.session_id || 'Unknown Session'}
                </span>
              </div>


            </CardBody>
          </Card>
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
        <p className="text-sm text-gray-600">
          Are you sure you want to terminate this specific login session?
          The corresponding device will be immediately logged out and forced to re-authenticate.
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
        <p className="text-sm text-gray-600">
          Are you sure you want to terminate <strong className="text-gray-900">every single active login session</strong>?
          This includes your current device's session, and you will be signed out immediately.
        </p>
      </Modal>

      {/* Delete account */}
      <Modal
        isOpen={deleteAccountModal}
        onClose={() => !isDeletingAccount && setDeleteAccountModal(false)}
        title="Permanently Delete Account?"
        confirmText="Delete Account"
        onConfirm={handleDeleteAccountConfirm}
        isLoading={isDeletingAccount}
        variant="danger"
      >
        <p className="text-sm text-gray-400">
          Are you sure you want to <strong className="text-red-400 font-bold">delete your account permanently</strong>?
          This action will immediately erase your profile, credentials, and sessions from our database.
          This action is absolute and cannot be reversed.
        </p>
      </Modal>
    </div>
  );
};
