import { Divider, IconButton } from '@mui/material';
import { UserAvatar } from '@/components/ui';
import { Logout } from '@mui/icons-material';
import { User } from '@/core/@types';
import { useClickOutside } from '@/core/hooks';
import { Dispatch, SetStateAction, useRef } from 'react';

export type UserPanelProps = {
  user: User;
  width: number;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  openDrawer: (isOpen: boolean) => void;
  signOut: () => void;
};

export function UserPanel({
  user,
  width,
  isOpen,
  setIsOpen,
  openDrawer,
  signOut,
}: UserPanelProps) {
  const userPanel = useRef<HTMLDivElement>(null);
  useClickOutside(userPanel, !isOpen || width < 1024, () => openDrawer(false), [
    userPanel,
    isOpen,
    width,
    openDrawer,
  ]);

  return (
    <>
      <IconButton
        color="inherit"
        size="small"
        onClick={() => setIsOpen((open) => !open)}
      >
        <UserAvatar size="medium" imageURL={user.imageURL} email={user.email} />
      </IconButton>

      <div
        className={
          isOpen
            ? 'absolute z-20 right-8 top-16 bg-white text-black shadow-[2px_5px_15px_0px_rgba(204,204,204,1)] rounded-lg py-2 border'
            : 'hidden'
        }
        ref={userPanel}
      >
        <div className="p-4 flex items-center gap-2 w-full overflow-hidden h-[60px] max-w-[400px]">
          <UserAvatar
            size="medium"
            imageURL={user.imageURL}
            email={user.email}
          />
          <div className="overflow-hidden text-ellipsis whitespace-nowrap">
            <div className="text-black text-sm font-bold overflow-hidden text-ellipsis whitespace-nowrap">
              {user.displayName}
            </div>
            <div className="text-gray-600 text-xs overflow-hidden text-ellipsis whitespace-nowrap">
              {user.email}
            </div>
          </div>
        </div>
        <Divider />
        <div
          className="mt-2 mx-2 px-4 py-2 flex items-center gap-2 hover:bg-blue-200 ease-in duration-150 transition-colors rounded-lg cursor-pointer text-sm"
          onClick={signOut}
        >
          <Logout fontSize="small" />
          <span>ออกจากระบบ</span>
        </div>
      </div>
    </>
  );
}
