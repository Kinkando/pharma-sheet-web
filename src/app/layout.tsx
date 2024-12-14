import type { Metadata } from 'next';
import './globals.css';
import { PublicEnvScript } from 'next-runtime-env';
import NextTopLoader from 'nextjs-toploader';
import GlobalContextProvider from '@/core/context/GlobalContextProvider';

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>Pharma Sheet</title>
        <PublicEnvScript />
      </head>
      <body>
        <NextTopLoader
          color="#49A569"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #49A569,0 0 5px #49A569"
        />
        <GlobalContextProvider>{children}</GlobalContextProvider>
      </body>
    </html>
  );
}
