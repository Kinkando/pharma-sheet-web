import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
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
