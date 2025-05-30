'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSignIn } from '@/modules/sign-in/hooks/signIn';
import { Button, TextField } from '@mui/material';
import { LoadingScreen } from '@/components/ui';
import { Visibility, VisibilityOff } from '@mui/icons-material';

export default function SignInCard() {
  const { isSigningIn, signInEmailPassword } = useSignIn();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isShowPassword, setIsShowPassword] = useState(false);

  useEffect(() => {
    window.parent.postMessage('DATA_CHANGED', 'http://sentinel-dev.localhost');
  }, [email, password]);

  return (
    <>
      <LoadingScreen isLoading={isSigningIn} />
      <div className="flex flex-col gap-4 max-w-96 rounded-lg p-4 bg-white w-full">
        <h1 className="text-2xl font-semibold text-center mb-2">เข้าสู่ระบบ</h1>
        <div className="flex flex-col gap-1">
          <label htmlFor="email">อีเมล</label>
          <TextField
            placeholder="กรุณาใส่อีเมลของคุณ"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) =>
              e.key === 'Enter' && signInEmailPassword(email, password)
            }
            disabled={isSigningIn}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="password">รหัสผ่าน</label>
          <TextField
            type={isShowPassword ? 'text' : 'password'}
            placeholder="กรุณาใส่รหัสผ่านของคุณ"
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
          ยืนยัน
        </Button>

        <div className="flex items-center justify-between gap-4">
          <Link
            href="/forgot-password"
            className="text-right text-blue-600 text-sm underline"
          >
            ลืมรหัสผ่าน
          </Link>
          <Link
            href="/sign-up"
            className="text-right text-blue-600 text-sm underline"
          >
            สมัครสมาชิก
          </Link>
        </div>
      </div>
    </>
  );
}
