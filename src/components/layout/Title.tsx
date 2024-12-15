'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { routers } from './BaseLayout';

export function DynamicTitle() {
  const pathname = usePathname();
  const title = useMemo(() => {
    const router = routers.find((router) => router.path === pathname);
    return (
      router?.title ??
      (pathname === '/sign-in'
        ? 'Sign In | PHARMA SHEET'
        : pathname === '/sign-up'
          ? 'Sign Up | PHARMA SHEET'
          : 'Not Found | PHARMA SHEET')
    );
  }, [pathname]);

  return <title>{title}</title>;
}
