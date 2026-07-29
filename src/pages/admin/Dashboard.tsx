import React, { useEffect, useState, useCallback } from 'react';
import { adminService } from '../../services/adminService';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import type { User, UserRole } from '../../types';
import { UserCard } from '../../components/UserCard';
import { Loader } from '../../components/ui/Loader';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { DeveloperProfileView } from '../../components/DeveloperProfileView';
import { UserPlus, RefreshCw, Users } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { signup, user } = useAuth();
  const { showApiError } = useToast();

  const [members, setMembers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const LIMIT = 10;

  // Profile View States
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedUserProfile, setSelectedUserProfile] = useState<any>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  // SignUp States
  const [signUpModalOpen, setSignUpModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('USER');
  const [isSigningUp, setIsSigningUp] = useState(false);

  const fetchMembers = useCallback(async (quiet = false, reset = false) => {
    if (!quiet && reset) setIsLoading(true);
    else if (!quiet && !reset) setIsLoadingMore(true);
    else if (reset) setIsRefreshing(true);
    
    try {
      const currentSkip = reset ? 0 : members.length;
      const data = await adminService.getMembers(currentSkip, LIMIT);
      
      if (reset) {
        setMembers(data);
      } else {
        setMembers(prev => [...prev, ...data]);
      }
      
      setHasMore(data.length === LIMIT);
    } catch (err) {
      showApiError(err, 'Failed to fetch members list.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
      setIsLoadingMore(false);
    }
  }, [showApiError, members.length]);

  useEffect(() => {
    if (members.length === 0 && hasMore) {
        fetchMembers(false, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Click handler to open member profile details
  const handleUserCardClick = async (member: User) => {
    setSelectedUser(member);
    setIsLoadingProfile(true);
    try {
      const profile = await adminService.getMemberProfile(member.user_id);
      setSelectedUserProfile(profile);
    } catch (err) {
      showApiError(err, 'Failed to fetch member developer profile. They may not have created a profile yet.');
      setSelectedUser(null);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handleBackToDirectory = () => {
    setSelectedUser(null);
    setSelectedUserProfile(null);
  };

  // Handle register user
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) {
      return;
    }

    setIsSigningUp(true);
    try {
      await signup({
        name: newName,
        email: newEmail,
        role: newRole,
      });
      // Clear inputs
      setNewName('');
      setNewEmail('');
      setNewRole('USER');
      setSignUpModalOpen(false);
      // Reload members list
      fetchMembers(true, true);
    } catch (err) {
      // AuthContext handles toast error output
      console.error(err);
    } finally {
      setIsSigningUp(false);
    }
  };

  // If fetching details
  if (isLoadingProfile) {
    return (
      <div className="py-24">
        <Loader size="lg" text="Loading developer profile details..." />
      </div>
    );
  }

  // If a profile is actively viewed
  if (selectedUser && selectedUserProfile) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-white tracking-[0.1em] uppercase flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-400" />
            <span>Member Developer Profile</span>
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Detailed experience, education, and credentials of {selectedUser.name}.
          </p>
        </div>

        <DeveloperProfileView
          profile={selectedUserProfile}
          userName={selectedUser.name}
          userEmail={selectedUser.email}
          onBack={handleBackToDirectory}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-[0.1em] uppercase flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-400" />
            <span>Member Management</span>
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Overview and administration of all registered user database accounts. Click a card to view their CV.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchMembers(true, true)}
            disabled={isLoading || isRefreshing}
            isLoading={isRefreshing}
          >
            {!isRefreshing && <RefreshCw className="w-3.5 h-3.5 mr-1.5" />}
            Refresh
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setSignUpModalOpen(true)}
            disabled={isLoading}
          >
            <UserPlus className="w-4 h-4 mr-1.5" />
            Register Member
          </Button>
        </div>
      </div>

      {/* Grid of User cards */}
      {isLoading ? (
        <div className="py-24">
          <Loader size="lg" text="Fetching registered accounts..." />
        </div>
      ) : members.filter(m => m.user_id !== user?.user_id).length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white/5 border border-white/10 rounded-xl p-8 text-center shadow-sm backdrop-blur-sm">
          <Users className="w-12 h-12 text-gray-500 mb-3" />
          <h3 className="text-sm font-semibold text-gray-300">No users found</h3>
          <p className="text-xs text-gray-400 mt-1">
            Get started by registering a user with the button above.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {members
            .filter((m) => m.user_id !== user?.user_id)
            .map((member) => (
              <UserCard
                key={member.user_id}
                user={member}
                onClick={() => handleUserCardClick(member)}
              />
            ))}
        </div>
      )}

      {/* Load More Button */}
      {!isLoading && members.length > 0 && hasMore && (
        <div className="flex justify-center pt-4 pb-8">
          <Button
            variant="outline"
            onClick={() => fetchMembers()}
            disabled={isLoadingMore}
            isLoading={isLoadingMore}
          >
            Load More
          </Button>
        </div>
      )}

      {/* Register user modal */}
      <Modal
        isOpen={signUpModalOpen}
        onClose={() => !isSigningUp && setSignUpModalOpen(false)}
        title="Register New User"
        isLoading={isSigningUp}
      >
        <form onSubmit={handleSignUpSubmit} className="space-y-4">
          <Input
            label="Full Name"
            id="reg-name"
            type="text"
            placeholder="John Doe"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            disabled={isSigningUp}
            required
          />
          <Input
            label="Email Address"
            id="reg-email"
            type="email"
            placeholder="john@example.com"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            disabled={isSigningUp}
            required
          />
          
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-300 tracking-[0.1em] uppercase">
              Role Type
            </label>
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value as UserRole)}
              className="w-full px-3.5 py-2.5 text-sm bg-black/40 text-white border border-white/10 rounded-lg shadow-inner focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all backdrop-blur-sm"
              disabled={isSigningUp}
            >
              <option value="USER" className="bg-[#0f172a]">USER (Standard Member)</option>
              <option value="ADMIN" className="bg-[#0f172a]">ADMIN (Administrative Access)</option>
            </select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={isSigningUp}
            >
              Confirm and Dispatch Registration
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
