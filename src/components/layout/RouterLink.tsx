import Link from 'next/link';
import { Router } from './BaseLayout';
import { useMemo } from 'react';

export type RouterLinkProps = {
  router: Router;
  pathname: string;
  onClick?: () => void;
};

export function RouterLink({ router, pathname, onClick }: RouterLinkProps) {
  const isActive = useMemo(() => {
    if (pathname !== '/') {
      return router.path.startsWith(pathname);
    }
    return router.path === '/' || router.path.startsWith('/?');
  }, [router, pathname]);

  return (
    <Link key={router.name} href={router.path} onClick={onClick}>
      <div
        className={
          'px-4 py-2 my-2 flex items-center gap-2 hover:bg-blue-200 ease-in duration-150 transition-colors rounded-lg cursor-pointer' +
          (isActive ? ' bg-blue-200' : '')
        }
      >
        {router.icon}
        <span>{router.name}</span>
      </div>
    </Link>
  );
}
