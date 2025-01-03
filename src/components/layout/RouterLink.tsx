import Link from 'next/link';
import { Router } from './BaseLayout';

export type RouterLinkProps = {
  router: Router;
  pathname: string;
  onClick?: () => void;
};

export function RouterLink({ router, pathname, onClick }: RouterLinkProps) {
  return (
    <Link key={router.name} href={router.path} onClick={onClick}>
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
  );
}
