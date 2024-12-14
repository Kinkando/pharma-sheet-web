import Link from 'next/link';
import { Router } from './BaseLayout';

export type SidebarProps = {
  pathname: string;
  routers: Router[];
};

export default function Sidebar({ pathname, routers }: SidebarProps) {
  return (
    <section className="p-4">
      {routers.map((router) => (
        <Link key={router.name} href={router.path}>
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
    </section>
  );
}
