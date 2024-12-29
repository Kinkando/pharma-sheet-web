import { WarehouseUser } from '@/core/@types';
import { Delete, ExitToApp } from '@mui/icons-material';
import { Button } from '@mui/material';
import { useState } from 'react';
import { RoleMenu } from './RoleMenu';
import { UserAvatar } from '@/components/ui';

export type UserManagementCardProps = {
  self?: boolean;
  user: WarehouseUser;
  editable?: boolean;
  deletable?: boolean;
  leavable?: boolean;
  onDelete: (user: WarehouseUser) => void;
  onEdit: (user: WarehouseUser) => void;
  onLeave: () => void;
};

export function UserManagementCard({
  self,
  user,
  editable,
  deletable,
  leavable,
  onDelete,
  onEdit,
  onLeave,
}: UserManagementCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="px-4 py-2 sm:flex sm:items-center sm:justify-between sm:gap-4 space-y-4 sm:space-y-0">
      <div className="flex items-center gap-4 w-full overflow-hidden">
        <UserAvatar size="large" imageURL={user.imageURL} email={user.email} />

        <div className="overflow-hidden text-ellipsis whitespace-nowrap">
          <div className="font-bold overflow-hidden text-ellipsis whitespace-nowrap">
            {user.displayName} {user.displayName && self ? '(คุณ)' : ''}
          </div>
          <div className="text-sm text-gray-500 overflow-hidden text-ellipsis whitespace-nowrap">
            {user.email} {!user.displayName && self ? '(คุณ)' : ''}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 relative">
        <Button
          variant="outlined"
          color="primary"
          className="w-full sm:w-fit"
          onClick={() => setIsOpen(true)}
        >
          <p className="whitespace-nowrap w-24 normal-case overflow-hidden text-ellipsis">
            Role: {user.role}
          </p>
        </Button>
        <RoleMenu
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          role={user.role}
          disabled={!editable}
          onClick={(role) => onEdit({ ...user, role })}
        />

        {!leavable ? (
          <Button
            variant="outlined"
            color="error"
            disabled={!deletable}
            onClick={() => onDelete(user)}
            className="w-full sm:w-fit"
          >
            <Delete />
          </Button>
        ) : (
          <Button
            variant="contained"
            color="error"
            onClick={onLeave}
            className="w-full sm:w-fit"
          >
            <ExitToApp />
          </Button>
        )}
      </div>
    </div>
  );
}
