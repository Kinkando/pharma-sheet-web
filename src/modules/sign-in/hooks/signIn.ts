import { AxiosError } from 'axios';
import { User } from 'firebase/auth';
import { useCallback, useContext, useState } from 'react';
import { Severity } from '@/core/@types';
import { GlobalContext } from '@/core/context';
import { signInWithEmailPassword, signInWithGoogle } from '@/core/lib';
import { getUser, verifyToken } from '@/core/repository';

export function useSignIn() {
  const { alert, setUser } = useContext(GlobalContext);
  const [isSigningIn, setIsSigningIn] = useState(false);

  const signIn = useCallback(async (callback: () => Promise<User>) => {
    setIsSigningIn(true);
    try {
      const firebaseUser = await callback();
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
      let severity: Severity = 'error';
      let err = `${error}`;
      if (error instanceof AxiosError && error.response) {
        err = `${error.response.data.error}`;
      }
      if (err.includes('invalid-email')) {
        severity = 'warning';
        err = 'Email is invalid, please try again!';
      }
      if (err.includes('invalid-login-credential')) {
        severity = 'warning';
        err = 'Email or password is wrong, please try again!';
      }
      alert({ message: err, severity });
    } finally {
      setIsSigningIn(false);
    }
  }, []);

  const signInGoogle = useCallback(async () => {
    signIn(signInWithGoogle);
  }, []);

  const signInEmailPassword = useCallback(
    async (email: string, password: string) => {
      if (email && password) {
        signIn(async () => await signInWithEmailPassword(email, password));
      }
    },
    [],
  );

  return {
    signInGoogle,
    signInEmailPassword,
    isSigningIn,
  };
}
