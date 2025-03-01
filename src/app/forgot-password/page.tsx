'use client';

import { Suspense } from 'react';
import ForgotPassword from '@/modules/forgot-password/components/ForgotPassword';

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ForgotPassword />
    </Suspense>
  );
}
