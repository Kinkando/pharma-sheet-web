import { createContext, Dispatch, SetStateAction } from 'react';
import { Alert, User } from '@/core/@types';

export const GlobalContext = createContext<{
  alert: (alert: Alert) => void;
  user?: User;
  setUser: Dispatch<SetStateAction<User | undefined>>;
  isReady: boolean;
}>({
  alert: () => {},
  setUser: () => {},
  isReady: false,
});
