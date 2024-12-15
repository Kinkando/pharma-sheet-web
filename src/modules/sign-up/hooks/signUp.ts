import { AxiosError } from 'axios';
import { useCallback, useContext, useState } from 'react';
import { Severity } from '@/core/@types';
import { GlobalContext } from '@/core/context';
import { signUpWithEmailPassword } from '@/core/lib';
import { getUser, verifyToken } from '@/core/repository';

export function useSignUp() {
  const { alert, setUser } = useContext(GlobalContext);
  const [isSigningUp, setIsSigningUp] = useState(false);

  const signUp = useCallback(async (email: string, password: string) => {
    setIsSigningUp(true);
    try {
      const firebaseUser = await signUpWithEmailPassword(email, password);
      if (!firebaseUser) {
        throw Error('Sign up failed, please try again!');
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
      if (err.includes('weak-password')) {
        severity = 'warning';
        err = 'Password should be at least 6 characters';
      }
      if (err.includes('email-already-in-use')) {
        severity = 'warning';
        err = 'This email is already in use, please change your email!';
      }
      alert({ message: err, severity });
    } finally {
      setIsSigningUp(false);
    }
  }, []);

  return {
    signUp,
    isSigningUp,
  };
}
