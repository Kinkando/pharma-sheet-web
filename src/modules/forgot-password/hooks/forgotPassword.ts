import { GlobalContext } from '@/core/context';
import { forgotPassword } from '@/core/lib';
import { useCallback, useContext, useState } from 'react';

export function useForgotPassword() {
  const { alert } = useContext(GlobalContext);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const sendEmail = useCallback(async (email: string) => {
    setIsSendingEmail(true);
    try {
      await forgotPassword(email);
      setCountdown(60);
      alert({
        severity: 'success',
        message: `กรุณาเช็คกล่องจดหมายในอีเมลของท่าน เพื่อทำการเปลี่ยนแปลงรหัสผ่าน`,
      });
      const countdownResetPassword = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(countdownResetPassword);
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      alert({ message: `${error}`, severity: 'error' });
    } finally {
      setIsSendingEmail(false);
    }
  }, []);

  return {
    countdown,
    sendEmail,
    isSendingEmail,
  };
}
