import { FirebaseConfig } from './firebase';

export interface Config {
  readonly apiHost: string;
  readonly apiKey: string;
  readonly firebase: FirebaseConfig;
}

const config: Config = {
  apiHost: process.env.NEXT_PUBLIC_API_HOST!,
  apiKey: process.env.NEXT_PUBLIC_API_KEY!,
  firebase: {
    credential: {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
    },
  },
};

export { config };
