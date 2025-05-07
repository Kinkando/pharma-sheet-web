'use client';

import { Suspense } from 'react';
import RotationDate from '@/modules/rotation-date/components/RotationDate';

export default function MedicineBrandPage() {
  return (
    <Suspense fallback={null}>
      <RotationDate />
    </Suspense>
  );
}
