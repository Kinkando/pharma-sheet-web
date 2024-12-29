'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button, TextField } from '@mui/material';
import { LoadingScreen } from '@/components/ui';
import { useForgotPassword } from '@/modules/forgot-password/hooks/forgotPassword';
import { isEmail } from '@/core/util';

export default function ForgotPasswordCard() {
  const { sendEmail, isSendingEmail, countdown } = useForgotPassword();
  const [email, setEmail] = useState('');

  return (
    <>
      <LoadingScreen isLoading={isSendingEmail} />
      <div className="flex flex-col gap-4 max-w-96 rounded-lg p-4 bg-white w-full">
        <h1 className="text-2xl font-semibold text-center mb-2">ลืมรหัสผ่าน</h1>
        <div className="flex flex-col gap-1">
          <label htmlFor="email">อีเมล</label>
          <TextField
            placeholder="กรุณาใส่อีเมลของคุณ"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && email && sendEmail(email)}
            disabled={isSendingEmail}
          />
        </div>
        <Button
          variant="contained"
          color="primary"
          size="large"
          className="!normal-case"
          disabled={
            !email || isSendingEmail || countdown > 0 || !isEmail(email)
          }
          onClick={() => sendEmail(email)}
        >
          {countdown > 0 ? `รอ ${countdown} วินาที` : 'ส่ง'}
        </Button>

        <div className="flex items-center justify-between gap-4">
          <Link
            href="/sign-up"
            className="text-right text-blue-600 text-sm underline"
          >
            สมัครสมาชิก
          </Link>
          <Link
            href="/sign-in"
            className="text-right text-blue-600 text-sm underline"
          >
            เข้าสู่ระบบ
          </Link>
        </div>
      </div>
    </>
  );
}
