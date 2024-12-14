import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { User } from '@/core/@types';
import { Router } from './BaseLayout';
import { Divider, Drawer, IconButton } from '@mui/material';
import { Logout, Menu as MenuIcon } from '@mui/icons-material';
import { useScreen } from '@/core/hooks';
import { useClickOutside } from '@/core/hooks';

export type TopbarProps = {
  pathname: string;
  user: User;
  routers: Router[];
  isOpenDrawer: boolean;
  onOpenDrawer: (isOpen: boolean) => void;
};

export default function Topbar({
  pathname,
  user,
  routers,
  isOpenDrawer,
  onOpenDrawer,
}: TopbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { width } = useScreen();
  const userPanel = useRef<HTMLDivElement>(null);

  const openDrawer = useCallback(
    (isOpen: boolean) => {
      setIsOpen(isOpen);
      onOpenDrawer(isOpen);
    },
    [onOpenDrawer],
  );

  useClickOutside(userPanel, !isOpen || width < 1024, () => openDrawer(false), [
    userPanel,
    isOpen,
    width,
    openDrawer,
  ]);

  const signOut = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/sign-in';
    openDrawer(false);
  };

  useEffect(() => {
    setIsOpen(isOpenDrawer);
  }, [isOpenDrawer]);

  useEffect(() => {
    setIsOpen(false);
    onOpenDrawer(false);
  }, [onOpenDrawer, width]);

  return (
    <div className="flex items-center justify-between px-8 py-4 h-[60px] bg-blue-300 gap-6">
      <Link href="/">
        <h1 className="font-bold text-xl text-black line-clamp-1">
          Pharma Sheet
        </h1>
      </Link>

      {/* User Panel */}
      <div className="hidden lg:block" id="user-panel">
        <IconButton
          color="inherit"
          size="small"
          onClick={() => setIsOpen((open) => !open)}
        >
          <Image
            src={user.imageURL}
            loader={() => user.imageURL}
            alt="Avatar"
            width={36}
            height={36}
            className="rounded-full"
          />
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
            <Image
              src={user.imageURL}
              loader={() => user.imageURL}
              alt="Avatar"
              width={36}
              height={36}
              objectFit="cover"
              className="rounded-full"
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
            <span>Sign Out</span>
          </div>
        </div>
      </div>

      {/* Hamburger Menu */}
      <div className="lg:hidden" id="hamburger-menu">
        <IconButton aria-label="menu" onClick={() => openDrawer(true)}>
          <MenuIcon className="text-black" />
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
            <Image
              src={user.imageURL}
              loader={() => user.imageURL}
              alt="Avatar"
              width={52}
              height={52}
              className="rounded-full"
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
                      'px-4 py-2 flex items-center gap-2 hover:bg-blue-200 ease-in duration-150 transition-colors rounded-lg cursor-pointer' +
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
              <span>Sign Out</span>
            </div>
          </div>
        </Drawer>
      </div>
    </div>
  );
}
