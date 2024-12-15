import { AxiosError } from 'axios';
import { useCallback, useContext, useState } from 'react';
import { GlobalContext } from '@/core/context';
import { signInWithGoogle } from '@/core/lib';
import { getUser, verifyToken } from '@/core/repository';

export function useSignIn() {
  const { alert, setUser } = useContext(GlobalContext);
  const [isSigningIn, setIsSigningIn] = useState(false);

  const signIn = useCallback(async () => {
    setIsSigningIn(true);
    try {
      const firebaseUser = await signInWithGoogle();
      if (!firebaseUser) {
        throw Error('Sign in failed, please try again!');
      }
      const idToken = await firebaseUser.getIdToken();
      const { accessToken, refreshToken } = await verifyToken(idToken);
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      const user = await getUser();
      setUser(user);
    } catch (error) {
      let err = `${error}`;
      if (error instanceof AxiosError && error.response) {
        err = `${error.response.data.error}`;
      }
      alert({ message: err, severity: 'error' });
    } finally {
      setIsSigningIn(false);
    }
  }, []);

  return {
    signIn,
    isSigningIn,
  };
}
