import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  checkActionCode,
  confirmPasswordReset,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from 'firebase/auth';
import app from './firebase';

const auth = getAuth(app);
auth.languageCode = 'th';

export async function signInWithGoogle() {
  await auth.authStateReady();
  const provider = new GoogleAuthProvider();
  const response = await signInWithPopup(auth, provider);
  return response?.user;
}

export async function signInWithEmailPassword(email: string, password: string) {
  await auth.authStateReady();
  const response = await signInWithEmailAndPassword(auth, email, password);
  return response?.user;
}

export async function signUpWithEmailPassword(email: string, password: string) {
  await auth.authStateReady();
  const response = await createUserWithEmailAndPassword(auth, email, password);
  return response?.user;
}

export async function signout() {
  await auth.authStateReady();
  await signOut(auth);
}

export async function changePassword(
  email: string,
  oldPassword: string,
  newPassword: string,
) {
  await auth.authStateReady();
  if (auth.currentUser) {
    const credential = EmailAuthProvider.credential(email, oldPassword);
    await reauthenticateWithCredential(auth.currentUser, credential);
    await updatePassword(auth.currentUser, newPassword);
  }
  return false;
}

export async function forgotPassword(email: string) {
  await auth.authStateReady();
  await sendPasswordResetEmail(auth, email);
}

export async function resetPassword(oobCode: string, password: string) {
  await auth.authStateReady();
  await confirmPasswordReset(auth, oobCode, password);
}

export async function getEmail(oobCode: string) {
  await auth.authStateReady();
  const res = await checkActionCode(auth, oobCode);
  if (res?.data?.email) {
    return res?.data?.email;
  }
  throw new Error('Invalid oobCode');
}

export async function getCurrentUser() {
  await auth.authStateReady();
  await waitForSignin();
  return auth.currentUser!;
}

async function waitForSignin() {
  return new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        unsubscribe();
        resolve('');
      }
    });
  });
}
