import { initializeApp } from 'firebase/app';
import config from '@/config/config';

const app = initializeApp(config.firebase.credential);

export default app;