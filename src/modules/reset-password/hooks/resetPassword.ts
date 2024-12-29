import { Severity } from '@/core/@types';
import { GlobalContext } from '@/core/context';
import { getEmail, resetPassword } from '@/core/lib';
import { AxiosError } from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';

export function useResetPassword() {
  const { alert } = useContext(GlobalContext);
  const searchParams = useSearchParams();
  const { push } = useRouter();
  const [email, setEmail] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [oobCode, setOobCode] = useState('');

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    try {
      const oobCode = searchParams.get('oobCode');
      if (!oobCode) {
        throw Error('invalid code');
      }
      const email = await getEmail(oobCode);
      setEmail(email);
      setOobCode(oobCode);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      push('/forgot-password');
    }
  };

  const confirmResetPassword = async (password: string) => {
    setIsResetting(true);
    try {
      await resetPassword(oobCode, password);
      alert({ message: 'เปลี่ยนรหัสผ่านสำเร็จ', severity: 'success' });
      push('/sign-in');
    } catch (error) {
      let severity: Severity = 'error';
      let err = `${error}`;
      if (error instanceof AxiosError && error.response) {
        err = `${error.response.data.error}`;
      }
      if (err.includes('weak-password')) {
        severity = 'warning';
        err = 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษรขึ้นไป!';
      }
      alert({ message: err, severity });
    } finally {
      setIsResetting(false);
    }
  };

  return {
    email,
    isResetting,
    confirmResetPassword,
  };
}
