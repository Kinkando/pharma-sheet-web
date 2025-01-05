'use client';

import { useCallback, useEffect, useState } from 'react';
import { Kanit } from 'next/font/google';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { Alert } from '@/core/@types';
import { GlobalContext } from '@/core/context';
import { useUser } from '@/core/hooks';
import { Alert as AlertComponent } from '@/components/ui';
import BaseLayout, { unauthorizedPaths } from '@/components/layout/BaseLayout';

const comicNeue = Kanit({
  weight: ['300', '400', '700'],
  subsets: ['latin'],
});

const theme = createTheme({
  typography: {
    fontFamily: 'Kanit, sans-serif', // Set your custom font as default for MUI
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
    if (_isReady && user && unauthorizedPaths.includes(pathname)) {
      push(params.get('redirect') || '/');
    } else if (_isReady && !user && !unauthorizedPaths.includes(pathname)) {
      push(`/sign-in?redirect=${pathname}`);
      return;
    }
    setIsReady(true);
  }, [pathname, _isReady, user, params]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
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
            <BaseLayout pathname={pathname} params={params}>
              {children}
            </BaseLayout>
          </div>
        )}
      </GlobalContext.Provider>
    </ThemeProvider>
  );
}
