'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useSignIn } from '@/modules/sign-in/hooks/signIn';
import { Button, Divider, TextField } from '@mui/material';
import { LoadingScreen } from '@/components/ui';
import { Visibility, VisibilityOff } from '@mui/icons-material';

export default function SignInCard() {
  const { signInGoogle, isSigningIn, signInEmailPassword } = useSignIn();
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
        <Divider />

        <div className="flex flex-col gap-5">
          <Button
            variant="outlined"
            className="w-full rounded-md p-2 drop-shadow-sm !normal-case"
            onClick={signInGoogle}
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
                unoptimized
              />
              <span className="ml-4">Sign in with Google</span>
            </div>
          </Button>
        </div>
        <a
          href="/sign-up"
          className="text-right text-blue-600 text-sm underline"
        >
          Sign Up
        </a>
      </div>
    </>
  );
}
