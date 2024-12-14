'use client';

import { useEffect, useState } from 'react';
import { Comic_Neue } from 'next/font/google';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { createTheme, ThemeProvider } from '@mui/material';
import { Alert } from '@/core/@types/alert';
import GlobalContext from '@/core/context/global';
import { useUser } from '@/core/hooks/user';
import AlertComponent from '@/components/ui/Alert';
import BaseLayout from '@/components/layout/BaseLayout';

const comicNeue = Comic_Neue({
  weight: ['300', '400', '700'],
  subsets: ['latin'],
});

const theme = createTheme({
  typography: {
    fontFamily: '"Comic Neue", cursive, "Noto Sans Thai", sans-serif', // Set your custom font as default for MUI
  },
});

export default function GlobalContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [alert, setAlert] = useState<Alert>({
    isOpen: false,
    message: '',
    severity: 'info',
  });
  const { user, setUser, isReady } = useUser();

  const { push } = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  // auth guard
  useEffect(() => {
    if (isReady && user && pathname === '/sign-in') {
      push(params.get('redirect') || '/');
    } else if (isReady && !user && !pathname.startsWith('/sign-in')) {
      push(`/sign-in?redirect=${pathname}`);
    }
  }, [pathname, isReady, user, params]);

  return (
    <ThemeProvider theme={theme}>
      <GlobalContext.Provider
        value={{
          alert: (alert) => setAlert({ ...alert, isOpen: true }),
          user,
          setUser,
          isReady,
        }}
      >
        <AlertComponent
          {...alert}
          onDismiss={() => setAlert((alert) => ({ ...alert, isOpen: false }))}
        />
        {isReady && (
          <div className={`${comicNeue.className}`}>
            <BaseLayout pathname={pathname}>{children}</BaseLayout>
          </div>
        )}
      </GlobalContext.Provider>
    </ThemeProvider>
  );
}
