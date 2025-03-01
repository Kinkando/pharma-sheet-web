'use client';

import { Suspense } from 'react';
import SignIn from '@/modules/sign-in/components/SignIn';

export default function SignInPage() {
  return (
    <Suspense fallback={null}>
      <SignIn />
    </Suspense>
  );
}
