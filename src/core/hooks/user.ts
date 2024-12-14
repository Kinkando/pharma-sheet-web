import { useEffect, useState } from 'react';
import { User } from '@/core/@types/user';
import { getUser } from '@/core/repository/user';

export function useUser() {
  const [isReady, setIsReady] = useState(false);
  const [user, setUser] = useState<User>();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const user = await getUser();
      if (user) {
        setUser(user);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsReady(true);
    }
  };

  return {
    user,
    setUser,
    isReady,
  };
}
