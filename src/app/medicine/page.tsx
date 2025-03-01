'use client';

import { Suspense } from 'react';
import Medicines from '@/modules/medicine/components/Medicines';

export default function MedicinePage() {
  return (
    <Suspense fallback={null}>
      <Medicines />
    </Suspense>
  );
}
