import { GlobalContext } from '@/core/context';
import React, { JSX, useContext, useMemo, useState } from 'react';
import { Backdrop } from '@mui/material';
import { Group, Home, Warehouse } from '@mui/icons-material';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export type Router = {
  title: string;
  icon: JSX.Element;
  name: string;
  path: string;
};

const skipBaseLayoutPaths = ['/sign-in', '/sign-up'];

export const unauthorizedPaths = ['/sign-in', '/sign-up'];

export const routers: Router[] = [
  {
    title: 'Home | PHARMA SHEET',
    icon: <Home />,
    name: 'หน้าแรก',
    path: '/',
  },
  {
    title: 'Warehouse | PHARMA SHEET',
    icon: <Warehouse />,
    name: 'ศูนย์สุขภาพชุมชน',
    path: '/warehouse',
  },
  {
    title: 'User | PHARMA SHEET',
    icon: <Group />,
    name: 'จัดการกับผู้ใช้งาน',
    path: '/user',
  },
];

export default function BaseLayout({
  children,
  pathname,
}: Readonly<{
  children: React.ReactNode;
  pathname: string;
}>) {
  const { user } = useContext(GlobalContext);
  const [openDrawer, setOpenDrawer] = useState(false);
  const isUseBaseLayout = useMemo(
    () => !skipBaseLayoutPaths.includes(pathname),
    [pathname],
  );
  if (!isUseBaseLayout || !user) {
    return children;
  }
  return (
    <>
      <Topbar
        pathname={pathname}
        user={user}
        routers={routers}
        onOpenDrawer={setOpenDrawer}
        isOpenDrawer={openDrawer}
      />
      <Backdrop
        open={openDrawer}
        onClick={() => setOpenDrawer(false)}
        className="z-10"
      ></Backdrop>
      <main className="w-full h-[calc(100vh-60px)] lg:flex">
        <section className="bg-white text-black max-w-64 min-w-64 w-64 hidden lg:block overflow-y-auto hide-scrollbar z-20">
          <Sidebar pathname={pathname} routers={routers} />
        </section>
        <main className="bg-white text-black lg:bg-gray-100 w-full h-full lg:p-6">
          <div className="bg-white lg:rounded-lg h-full overflow-auto">
            {children}
          </div>
        </main>
      </main>
    </>
  );
}
