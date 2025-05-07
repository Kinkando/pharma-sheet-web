import { Suspense } from 'react';
import Medicines from '@/modules/house/components/Medicines';

export default function HousePage() {
  return (
    <Suspense fallback={null}>
      <Medicines />
    </Suspense>
  );
}
