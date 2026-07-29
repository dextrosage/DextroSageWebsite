import React from 'react';
import type { Session } from '../types';
import { Card, CardBody } from './ui/Card';
import { Button } from './ui/Button';
import { Key, Trash2 } from 'lucide-react';

interface SessionCardProps {
  session: Session;
  onDelete?: () => void;
  isDeleting?: boolean;
  isCurrent?: boolean;
}

export const SessionCard: React.FC<SessionCardProps> = ({
  session,
  onDelete,
  isDeleting = false,
  isCurrent = false,
}) => {
  return (
    <Card hoverable className="overflow-hidden">
      <CardBody className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3 min-w-0">
          <div className="p-2 bg-white/5 text-gray-400 border border-white/10 rounded-lg flex-shrink-0">
            <Key className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Session ID</p>
              {isCurrent && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xxs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 uppercase tracking-wider scale-90 origin-left">
                  Current
                </span>
              )}
            </div>
            <p className="text-sm font-mono text-white truncate" title={session.session_id}>
              {session.session_id}
            </p>
          </div>
        </div>

        {onDelete && (
          <Button
            variant="danger"
            size="sm"
            className="flex-shrink-0 p-2 h-9 w-9 rounded-lg"
            onClick={onDelete}
            isLoading={isDeleting}
            title="Terminate Session"
          >
            {!isDeleting && <Trash2 className="w-4 h-4" />}
          </Button>
        )}
      </CardBody>
    </Card>
  );
};
