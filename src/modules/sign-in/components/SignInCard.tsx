'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useSignIn } from '@/modules/sign-in/hooks/signIn';
import { Button, TextField } from '@mui/material';
import { LoadingScreen } from '@/components/ui';
import { Visibility, VisibilityOff } from '@mui/icons-material';

export default function SignInCard() {
  const { isSigningIn, signInEmailPassword } = useSignIn();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isShowPassword, setIsShowPassword] = useState(false);

  return (
    <>
      <LoadingScreen isLoading={isSigningIn} />
      <div className="flex flex-col gap-4 max-w-96 rounded-lg p-4 bg-white w-full">
        <h1 className="text-2xl font-semibold text-center mb-2">Sign In</h1>
        <div className="flex flex-col gap-1">
          <label htmlFor="email">Email</label>
          <TextField
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) =>
              e.key === 'Enter' && signInEmailPassword(email, password)
            }
            disabled={isSigningIn}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="password">Password</label>
          <TextField
            type={isShowPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) =>
              e.key === 'Enter' && signInEmailPassword(email, password)
            }
            disabled={isSigningIn}
            slotProps={{
              input: {
                endAdornment: isShowPassword ? (
                  <Visibility
                    className="cursor-pointer"
                    onClick={() => setIsShowPassword(false)}
                  />
                ) : (
                  <VisibilityOff
                    className="cursor-pointer"
                    onClick={() => setIsShowPassword(true)}
                  />
                ),
              },
            }}
          />
        </div>
        <Button
          variant="contained"
          color="primary"
          size="large"
          className="!normal-case"
          disabled={!email || !password || isSigningIn}
          onClick={() => signInEmailPassword(email, password)}
        >
          Sign In
        </Button>
        <Link
          href="/sign-up"
          className="text-right text-blue-600 text-sm underline"
        >
          Sign Up
        </Link>
      </div>
    </>
  );
}
