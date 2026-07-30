import React, { useEffect, useState, useCallback } from 'react';
import { userService } from '../../services/userService';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import type { User } from '../../types';
import { UserCard } from '../../components/UserCard';
import { Loader } from '../../components/ui/Loader';
import { Button } from '../../components/ui/Button';
import { DeveloperProfileView } from '../../components/DeveloperProfileView';
import { RefreshCw, Users } from 'lucide-react';

export const UserDashboard: React.FC = () => {
  const { user } = useAuth();
  const { showApiError } = useToast();

  const [members, setMembers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Profile View States
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedUserProfile, setSelectedUserProfile] = useState<any>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  const fetchMembers = useCallback(async (quiet = false) => {
    if (!quiet) setIsLoading(true);
    else setIsRefreshing(true);

    try {
      const data = await userService.getMembers();
      setMembers(data);
    } catch (err) {
      showApiError(err, 'Failed to retrieve members directory.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [showApiError]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  // Click handler to open member profile
  const handleUserCardClick = async (member: User) => {
    setSelectedUser(member);
    setIsLoadingProfile(true);
    try {
      const profile = await userService.getMemberProfile(member.user_id);
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

  const directoryMembers = members.filter(m => m.user_id !== user?.user_id);

  return (
    <div className="space-y-6">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-[0.1em] uppercase flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-400" />
            <span>Members Directory</span>
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Browse through all active users and administrators in this organization. Click a card to view their CV.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchMembers(true)}
          disabled={isLoading || isRefreshing}
          isLoading={isRefreshing}
        >
          {!isRefreshing && <RefreshCw className="w-3.5 h-3.5 mr-1.5" />}
          Refresh
        </Button>
      </div>

      {/* Grid of User cards */}
      {isLoading ? (
        <div className="py-24">
          <Loader size="lg" text="Loading members directory..." />
        </div>
      ) : directoryMembers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white/5 border border-white/10 rounded-xl p-8 text-center shadow-sm backdrop-blur-sm">
          <Users className="w-12 h-12 text-gray-500 mb-3" />
          <h3 className="text-sm font-semibold text-gray-300">No users found</h3>
          <p className="text-xs text-gray-400 mt-1">
            The member registry database is currently empty.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {directoryMembers.map((member) => (
            <UserCard
              key={member.user_id}
              user={member}
              onClick={() => handleUserCardClick(member)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
