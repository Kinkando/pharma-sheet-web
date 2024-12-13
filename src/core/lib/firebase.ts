import config from '@/config/config';
import { initializeApp } from 'firebase/app';

const app = initializeApp(config.firebase.credential);

export default app;
