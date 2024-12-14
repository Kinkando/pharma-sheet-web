import { createContext, Dispatch, SetStateAction } from 'react';
import { Alert } from '@/core/@types/alert';
import { User } from '@/core/@types/user';

const GlobalContext = createContext<{
  alert: (alert: Alert) => void;
  user?: User;
  setUser: Dispatch<SetStateAction<User | undefined>>;
  isReady: boolean;
}>({
  alert: () => {},
  setUser: () => {},
  isReady: false,
});

export default GlobalContext;
