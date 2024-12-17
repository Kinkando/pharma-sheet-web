import { UserAvatar } from '@/components/ui';
import { WarehouseUser } from '@/core/@types';
import { Check, Close } from '@mui/icons-material';
import { Button } from '@mui/material';

export type JoinRequestProps = {
  user: WarehouseUser;
  onApprove: () => void;
  onReject: () => void;
  approvable?: boolean;
  rejectable?: boolean;
};

export function JoinRequestCard({
  user,
  onApprove,
  onReject,
  approvable,
  rejectable,
}: JoinRequestProps) {
  return (
    <div className="px-4 py-2 sm:flex sm:items-center sm:justify-between sm:gap-4 space-y-4 sm:space-y-0">
      <div className="flex items-center gap-4 w-full overflow-hidden">
        <UserAvatar size="large" imageURL={user.imageURL} email={user.email} />

        <div className="overflow-hidden text-ellipsis whitespace-nowrap">
          <div className="font-bold overflow-hidden text-ellipsis whitespace-nowrap">
            {user.displayName}
          </div>
          <div className="text-sm text-gray-500 overflow-hidden text-ellipsis whitespace-nowrap">
            {user.email}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 relative">
        <Button
          variant="contained"
          color="success"
          className="w-full sm:w-fit"
          onClick={onApprove}
          disabled={!approvable}
        >
          <Check />
          <p>Approve</p>
        </Button>

        <Button
          variant="contained"
          color="error"
          onClick={onReject}
          className="w-full sm:w-fit"
          disabled={!rejectable}
        >
          <Close />
          <p>Reject</p>
        </Button>
      </div>
    </div>
  );
}
