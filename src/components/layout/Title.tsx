'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { routers } from './BaseLayout';

const staticRoutes = [
  {
    path: '/sign-in',
    title: 'Sign In | PHARMA SHEET',
  },
  {
    path: '/sign-up',
    title: 'Sign Up | PHARMA SHEET',
  },
  {
    path: '/forgot-password',
    title: 'Forgot Password | PHARMA SHEET',
  },
  {
    path: '/reset-password',
    title: 'Reset Password | PHARMA SHEET',
  },
];

export function DynamicTitle() {
  const pathname = usePathname();
  const title = useMemo(() => {
    const router = [...routers, ...staticRoutes].find(
      (router) => router.path === pathname,
    );
    return router?.title ?? 'Not Found | PHARMA SHEET';
  }, [pathname]);

  return <title>{title}</title>;
}
