import Link from 'next/link';
import { Logout, Menu } from '@mui/icons-material';
import { Divider, Drawer, IconButton } from '@mui/material';
import { UserAvatar } from '@/components/ui';
import { Router } from './BaseLayout';
import { User } from '@/core/@types';

export type UserDrawerProps = {
  user: User;
  routers: Router[];
  pathname: string;
  signOut: () => void;
  isOpen: boolean;
  openDrawer: (isOpen: boolean) => void;
};

export function UserDrawer({
  user,
  routers,
  pathname,
  signOut,
  isOpen,
  openDrawer,
}: UserDrawerProps) {
  return (
    <>
      <IconButton aria-label="menu" onClick={() => openDrawer(true)}>
        <Menu className="text-black" />
      </IconButton>
      <Drawer
        open={isOpen}
        onClose={() => openDrawer(false)}
        variant="persistent"
        classes={{
          paper: 'w-[calc(100%-30px)] max-w-[360px]',
        }}
      >
        <div className="p-4 flex items-center gap-4 w-full overflow-hidden">
          <UserAvatar
            size="large"
            imageURL={user.imageURL}
            email={user.email}
          />
          <div className="overflow-hidden text-ellipsis whitespace-nowrap">
            <div className="font-bold overflow-hidden text-ellipsis whitespace-nowrap">
              {user.displayName}
            </div>
            <div className="text-sm text-gray-500 overflow-hidden text-ellipsis whitespace-nowrap">
              {user.email}
            </div>
          </div>
        </div>
        <Divider />

        <div className="p-4 flex flex-col justify-between h-full">
          <main>
            {routers.map((router) => (
              <Link
                key={router.name}
                href={router.path}
                onClick={() => openDrawer(false)}
              >
                <div
                  className={
                    'px-4 py-2 my-2 flex items-center gap-2 hover:bg-blue-200 ease-in duration-150 transition-colors rounded-lg cursor-pointer' +
                    (pathname === router.path ? ' bg-blue-200' : '')
                  }
                >
                  {router.icon}
                  <span>{router.name}</span>
                </div>
              </Link>
            ))}
          </main>
          <div
            className="px-4 py-2 flex items-center gap-2 hover:bg-blue-200 ease-in duration-150 transition-colors rounded-lg cursor-pointer"
            onClick={signOut}
          >
            <Logout />
            <span>ออกจากระบบ</span>
          </div>
        </div>
      </Drawer>
    </>
  );
}
