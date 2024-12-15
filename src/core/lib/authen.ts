import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import app from './firebase';

const auth = getAuth(app);
auth.languageCode = 'th';

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  const response = await signInWithPopup(auth, provider);
  return response?.user;
}

export async function signout() {
  await signOut(auth);
}

export async function getCurrentUser() {
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
