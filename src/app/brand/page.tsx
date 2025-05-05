'use client';

import { Suspense } from 'react';
import MedicineBrands from '@/modules/brand/components/Brands';

export default function MedicineBrandPage() {
  return (
    <Suspense fallback={null}>
      <MedicineBrands />
    </Suspense>
  );
}
