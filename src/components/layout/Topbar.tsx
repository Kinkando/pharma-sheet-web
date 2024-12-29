import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { User } from '@/core/@types';
import { Router } from './BaseLayout';
import { useScreen } from '@/core/hooks';
import { UserPanel } from './UserPanel';
import { UserDrawer } from './UserDrawer';

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

  const openDrawer = useCallback(
    (isOpen: boolean) => {
      setIsOpen(isOpen);
      onOpenDrawer(isOpen);
    },
    [onOpenDrawer],
  );

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
          บ้านเลขที่ยา
        </h1>
      </Link>

      <div className="hidden lg:block">
        <UserPanel
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          openDrawer={openDrawer}
          width={width}
          user={user}
          signOut={signOut}
        />
      </div>

      <div className="lg:hidden">
        <UserDrawer
          isOpen={isOpen}
          openDrawer={openDrawer}
          user={user}
          signOut={signOut}
          pathname={pathname}
          routers={routers}
        />
      </div>
    </div>
  );
}
