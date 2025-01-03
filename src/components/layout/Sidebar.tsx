import { Router } from './BaseLayout';
import { RouterLink } from './RouterLink';

export type SidebarProps = {
  pathname: string;
  routers: Router[];
};

export default function Sidebar({ pathname, routers }: SidebarProps) {
  return (
    <section className="p-4">
      {routers.map((router) => (
        <RouterLink key={router.name} router={router} pathname={pathname} />
      ))}
    </section>
  );
}
