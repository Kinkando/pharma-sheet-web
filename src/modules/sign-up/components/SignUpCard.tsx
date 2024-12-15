'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useSignUp } from '@/modules/sign-up/hooks/signUp';
import { Button, TextField } from '@mui/material';
import { LoadingScreen } from '@/components/ui';
import { Visibility, VisibilityOff } from '@mui/icons-material';

export default function SignUpCard() {
  const { signUp, isSigningUp } = useSignUp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);

  return (
    <>
      <LoadingScreen isLoading={isSigningUp} />
      <div className="flex flex-col gap-4 max-w-96 rounded-lg p-4 bg-white w-full">
        <h1 className="text-2xl font-semibold text-center mb-2">Sign Up</h1>
        <div className="flex flex-col gap-1">
          <label htmlFor="email">Email</label>
          <TextField
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) =>
              e.key === 'Enter' &&
              password === confirmPassword &&
              signUp(email, password)
            }
            disabled={isSigningUp}
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
              e.key === 'Enter' &&
              password === confirmPassword &&
              signUp(email, password)
            }
            disabled={isSigningUp}
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
        <div className="flex flex-col gap-1">
          <label htmlFor="confirm-password">Confirm Password</label>
          <TextField
            type={isShowConfirmPassword ? 'text' : 'password'}
            placeholder="Enter your password again"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onKeyDown={(e) =>
              e.key === 'Enter' &&
              password === confirmPassword &&
              signUp(email, password)
            }
            disabled={isSigningUp}
            slotProps={{
              input: {
                endAdornment: isShowConfirmPassword ? (
                  <Visibility
                    className="cursor-pointer"
                    onClick={() => setIsShowConfirmPassword(false)}
                  />
                ) : (
                  <VisibilityOff
                    className="cursor-pointer"
                    onClick={() => setIsShowConfirmPassword(true)}
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
          disabled={
            !email ||
            !password ||
            !confirmPassword ||
            password !== confirmPassword ||
            isSigningUp
          }
          onClick={() => signUp(email, password)}
        >
          Sign Up
        </Button>

        <Link
          href="/sign-in"
          className="text-right text-blue-600 text-sm underline"
        >
          Sign In
        </Link>
      </div>
    </>
  );
}
