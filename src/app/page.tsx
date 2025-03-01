import { Suspense } from 'react';
import Home from '@/modules/home/components/Home';

export default function HomePage() {
  return (
    <Suspense fallback={null}>
      <Home />
    </Suspense>
  );
}
