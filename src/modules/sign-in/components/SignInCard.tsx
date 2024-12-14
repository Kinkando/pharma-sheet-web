'use client';

import Image from 'next/image';
import { useSignIn } from '@/modules/sign-in/hooks/sign-in';
import { Button } from '@mui/material';

export default function SignInCard() {
  const { signIn, isSigningIn } = useSignIn();
  return (
    <div className="flex flex-col gap-10 max-w-96 w-full">
      <h1 className="text-2xl font-semibold text-center">
        Welcome to Pharma Sheet
      </h1>
      <div className="flex flex-col gap-5">
        <Button
          variant="outlined"
          className="w-full rounded-md p-2 drop-shadow-sm !normal-case"
          onClick={signIn}
          size="large"
          disabled={isSigningIn}
          sx={{
            backgroundColor: '#fff',
            color: '#000',
            borderColor: 'rgb(229 231 235)',
            height: '56.69px',
          }}
        >
          <div className="flex items-center justify-center">
            <Image
              src={'/images/google-icon.png'}
              width={24}
              height={24}
              alt="Google Icon"
              className="w-6 h-6"
            />
            <span className="ml-4">Sign in with Google</span>
          </div>
        </Button>
      </div>
    </div>
  );
}
