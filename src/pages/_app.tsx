import '@/styles/globals.css';
import { Toaster } from 'react-hot-toast';
import { SessionProvider } from 'next-auth/react';
import { Poppins } from 'next/font/google';
import DashboardShell from '@/layouts/DashboardShell';
import Head from 'next/head';
import { Session } from 'next-auth';
import { ComponentType } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from '@/contexts/ThemeContext';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

// Function to check if the current page is an auth page or error page
const isAuthPage = (pathname: string): boolean => {
  return pathname === '/login' || 
         pathname === '/register' || 
         pathname === '/401' || 
         pathname === '/403' || 
         pathname === '/404' || 
         pathname === '/500';
};

// Function to check if the current page is an error page
const isErrorPage = (pathname: string): boolean => {
  return pathname === '/401' || 
         pathname === '/403' || 
         pathname === '/404' || 
         pathname === '/500' ||
         pathname.startsWith('/_error') ||
         pathname.includes('[...slug]');
};

// Function to determine the active page based on the pathname
const getActivePage = (pathname: string): 'dashboard' | 'upload' | 'pending' | 'signed' | 'documents' => {
  if (pathname === '/') return 'dashboard';
  const pathParts: string[] = pathname.split('/');
  const path: string = pathParts[1] || '';
  if (path === 'documents') {
    const subPath: string = pathParts[2] || '';
    if (subPath === 'upload') return 'upload';
    if (subPath === 'pending') return 'pending';
    if (subPath === 'signed') return 'signed';
    return 'documents';
  }
  return 'dashboard';
};

// Define a type for the page props
type CustomPageProps = {
  session: Session | null;
  [key: string]: unknown;
};

// Define a type for the App component props
type AppComponentProps = {
  Component: ComponentType<Record<string, unknown>>;
  pageProps: CustomPageProps;
  router: {
    pathname: string;
  };
};

export default function App({ 
  Component, 
  pageProps, 
  router: appRouter 
}: AppComponentProps) {
  const { session, ...restPageProps } = pageProps;
  const isAuth = isAuthPage(appRouter.pathname);
  const isError = isErrorPage(appRouter.pathname);
  const activePage = getActivePage(appRouter.pathname);

  return (
    <SessionProvider session={session}>
      <ThemeProvider>
        <Head>
          <title>DigitSign - Assinatura Digital</title>
          <meta name="description" content="Sistema de assinatura digital de documentos" />
        </Head>
        <div className={`${poppins.variable} font-sans antialiased`}>
          <AnimatePresence mode="wait">
            {isAuth || isError ? (
              <Component {...restPageProps} key={appRouter.pathname} />
            ) : (
              <DashboardShell activePage={activePage}>
                <Component {...restPageProps} />
              </DashboardShell>
            )}
          </AnimatePresence>
        </div>
        <Toaster />
      </ThemeProvider>
    </SessionProvider>
  );
}
