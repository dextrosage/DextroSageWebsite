import React from 'react';
import type { User } from '../types';
import { Card, CardBody, CardFooter } from './ui/Card';
import { Button } from './ui/Button';
import { User as UserIcon, Mail, Phone, Shield } from 'lucide-react';

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

  return (
    <Card
      hoverable
      className={`overflow-hidden bg-[#020617]/60 backdrop-blur-md border border-white/10 ${onClick ? 'cursor-pointer transition-all hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] hover:border-blue-500/50' : ''}`}
      onClick={onClick}
    >
      <CardBody className="space-y-4">
        {/* Header Block */}
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${isAdmin ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'}`}>
            {isAdmin ? <Shield className="w-5 h-5" /> : <UserIcon className="w-5 h-5" />}
          </div>
          <div>
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

      {/* Conditional actions footer */}
      {(onViewSessions || onDelete) && (
        <CardFooter className="flex items-center gap-2 pt-3 pb-3 border-t border-white/5 bg-black/20">
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
      )}
    </Card>
  );
};
