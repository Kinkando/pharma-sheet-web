import { useContext, useState } from 'react';
import { GlobalContext } from '@/core/context';
import { changePassword } from '@/core/lib';
import { getUser, updateUser } from '@/core/repository';

export function useProfile() {
  const { alert, setUser } = useContext(GlobalContext);

  const [isLoading, setIsLoading] = useState(false);

  const onUpdateProfile = async (
    displayName: string,
    profileImage?: File | null,
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
  ) => {
    setIsLoading(true);
    try {
      await changePassword(email, oldPassword, newPassword);
      alert({
        severity: 'success',
        message: 'เปลี่ยนรหัสผ่านสำเร็จ',
      });
    } catch (error) {
      alert({ message: `${error}`, severity: 'error' });
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
