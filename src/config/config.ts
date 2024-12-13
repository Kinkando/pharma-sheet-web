import { env } from 'next-runtime-env';
import { FirebaseConfig } from './firebase';

export interface Config {
  readonly apiHost: string;
  readonly apiKey: string;
  readonly firebase: FirebaseConfig;
}

const config: Config = {
  apiHost: env('NEXT_PUBLIC_API_HOST')!,
  apiKey: env('NEXT_PUBLIC_API_KEY')!,
  firebase: {
    credential: {
      apiKey: env('NEXT_PUBLIC_FIREBASE_API_KEY')!,
      authDomain: env('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN')!,
      projectId: env('NEXT_PUBLIC_FIREBASE_PROJECT_ID')!,
      storageBucket: env('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET')!,
      messagingSenderId: env('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID')!,
      appId: env('NEXT_PUBLIC_FIREBASE_APP_ID')!,
    },
  },
};

export default config;
