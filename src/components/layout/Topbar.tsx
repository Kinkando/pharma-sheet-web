import Link from 'next/link';
import { User } from '@/core/@types';
import { Router } from './BaseLayout';
import { UserPanel } from './UserPanel';
import { UserDrawer } from './UserDrawer';
import { useScreen } from '@/core/hooks';
import { useEffect } from 'react';

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
  const { width } = useScreen();

  const signOut = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/sign-in';
    onOpenDrawer(false);
  };

  useEffect(() => {
    onOpenDrawer(false);
  }, [onOpenDrawer, width]);

  return (
    <div className="flex items-center justify-between px-8 py-4 h-[60px] bg-blue-300 gap-6">
      <div className="lg:hidden">
        <UserDrawer
          isOpen={isOpenDrawer}
          openDrawer={onOpenDrawer}
          user={user}
          signOut={signOut}
          pathname={pathname}
          routers={routers}
        />
      </div>

      <h1 className="font-bold text-xl text-black line-clamp-1 w-full">
        <Link href="/" className="w-fit">
          บ้านเลขที่ยา
        </Link>
      </h1>

      <UserPanel user={user} width={width} signOut={signOut} />
    </div>
  );
}
