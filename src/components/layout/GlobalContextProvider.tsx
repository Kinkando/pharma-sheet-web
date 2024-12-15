'use client';

import { useCallback, useEffect, useState } from 'react';
import { Comic_Neue } from 'next/font/google';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { createTheme, ThemeProvider } from '@mui/material';
import { Alert } from '@/core/@types';
import { GlobalContext } from '@/core/context';
import { useUser } from '@/core/hooks';
import { Alert as AlertComponent } from '@/components/ui';
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

export function GlobalContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [alert, setAlert] = useState<Alert>({
    isOpen: false,
    message: '',
    severity: 'info',
  });
  const { user, setUser, isReady: _isReady } = useUser();
  const [isReady, setIsReady] = useState(false);

  const { push } = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  useEffect(() => {
    authGuard();
  }, [pathname, _isReady, user, params]);

  const authGuard = useCallback(async () => {
    if (!_isReady) {
      return;
    }
    if (_isReady && user && pathname === '/sign-in') {
      push(params.get('redirect') || '/');
    } else if (_isReady && !user && !pathname.startsWith('/sign-in')) {
      push(`/sign-in?redirect=${pathname}`);
      return;
    }
    setIsReady(true);
  }, [pathname, _isReady, user, params]);

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
