// pages/_app.tsx
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { NextUIProvider } from '@nextui-org/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { MsalProvider } from '@/contexts/MsalProvider'; // Ensure the correct path
import { useRouter } from 'next/router';
import '@/styles/globals.css';

export default function App({
                              Component,
                              pageProps: { session, ...pageProps },
                            }: AppProps) {
  const router = useRouter();
  // @ts-ignore
    return (
      <SessionProvider session={session}>
        <NextUIProvider navigate={router.push}>
          <NextThemesProvider>
            <MsalProvider>
              <Component {...pageProps} />
            </MsalProvider>
          </NextThemesProvider>
        </NextUIProvider>
      </SessionProvider>
  );
}
