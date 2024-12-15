import type { Metadata } from 'next';
import './globals.css';
import { PublicEnvScript } from 'next-runtime-env';
import NextTopLoader from 'nextjs-toploader';
import { GlobalContextProvider } from '@/components/layout/GlobalContextProvider';
import { DynamicTitle } from '@/components/layout/Title';

export const metadata: Metadata = {
  description:
    'Phama Sheet Web Application for managing medicine data across many warehouses.',
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
        <DynamicTitle />
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
