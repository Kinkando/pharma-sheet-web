import { AxiosError } from 'axios';
import { useContext, useState } from 'react';
import { Severity } from '@/core/@types';
import { GlobalContext } from '@/core/context';
import { changePassword } from '@/core/lib';
import { getUser, updateUser } from '@/core/repository';

export function useProfile() {
  const { alert, setUser } = useContext(GlobalContext);

  const [isLoading, setIsLoading] = useState(false);

  const onUpdateProfile = async (
    displayName: string,
    profileImage: File | null,
    onSuccess: () => void,
  ) => {
    setIsLoading(true);
    try {
      await updateUser(displayName, profileImage);
      const user = await getUser();
      if (!user) {
        throw new Error('ไม่พบข้อมูลผู้ใช้');
      }
      setUser(user);
      alert({
        severity: 'success',
        message: 'อัพเดทข้อมูลสำเร็จ',
      });
      onSuccess();
    } catch (error) {
      alert({ message: `${error}`, severity: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const onChangePassword = async (
    email: string,
    oldPassword: string,
    newPassword: string,
    onSuccess: () => void,
  ) => {
    setIsLoading(true);
    try {
      await changePassword(email, oldPassword, newPassword);
      alert({
        severity: 'success',
        message: 'เปลี่ยนรหัสผ่านสำเร็จ',
      });
      onSuccess();
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
      if (err.includes('auth/invalid-credential')) {
        severity = 'warning';
        err = 'รหัสผ่านเดิมไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง!';
      }
      alert({ message: err, severity });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    onUpdateProfile,
    onChangePassword,
  };
}
