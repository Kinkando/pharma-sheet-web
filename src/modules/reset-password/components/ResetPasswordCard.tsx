'use client';

import { useState } from 'react';
import { useResetPassword } from '@/modules/reset-password/hooks/resetPassword';
import { Button, TextField } from '@mui/material';
import { LoadingScreen } from '@/components/ui';
import { Visibility, VisibilityOff } from '@mui/icons-material';

export default function ResetPasswordCard() {
  const { email, isResetting, confirmResetPassword } = useResetPassword();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);

  const enterResetPassword = async (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (
      e.key === 'Enter' &&
      password.length >= 6 &&
      confirmPassword.length >= 6 &&
      password === confirmPassword
    ) {
      await confirmResetPassword(password);
    }
  };

  return (
    <>
      <LoadingScreen isLoading={isResetting || !email} />
      <div className="flex flex-col gap-4 max-w-96 rounded-lg p-4 bg-white w-full">
        <h1 className="text-2xl font-semibold text-center mb-2">
          Reset Password
        </h1>
        <div className="flex flex-col gap-1">
          <label htmlFor="email">อีเมล</label>
          <TextField placeholder="กรุณาใส่อีเมลของคุณ" value={email} disabled />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="password">รหัสผ่านใหม่</label>
          <TextField
            type={isShowPassword ? 'text' : 'password'}
            placeholder="กรุณาใส่รหัสผ่านใหม่ของคุณ"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={enterResetPassword}
            disabled={isResetting}
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
          <label htmlFor="confirm-password">ยืนยันรหัสผ่านใหม่</label>
          <TextField
            type={isShowConfirmPassword ? 'text' : 'password'}
            placeholder="กรุณาใส่รหัสผ่านใหม่อีกครั้ง"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onKeyDown={enterResetPassword}
            disabled={isResetting}
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
            isResetting
          }
          onClick={() => confirmResetPassword(password)}
        >
          ยืนยัน
        </Button>
      </div>
    </>
  );
}
