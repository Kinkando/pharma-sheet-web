import { Suspense } from 'react';
import User from '@/modules/user/components/User';

export default function UserPage() {
  return (
    <Suspense fallback={null}>
      <User />
    </Suspense>
  );
}
