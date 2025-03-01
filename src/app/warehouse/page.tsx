import { Suspense } from 'react';
import Warehouse from '@/modules/warehouse/components/Warehouse';

export default function WarehousePage() {
  return (
    <Suspense fallback={null}>
      <Warehouse />
    </Suspense>
  );
}
