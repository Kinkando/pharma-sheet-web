'use client';

import { Suspense } from 'react';
import SignUp from '@/modules/sign-up/components/SignUp';

export default function SignUpPage() {
  return (
    <Suspense fallback={null}>
      <SignUp />
    </Suspense>
  );
}
