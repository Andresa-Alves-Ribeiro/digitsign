import '@/styles/globals.css';
import { Toaster } from 'react-hot-toast';
import { SessionProvider } from 'next-auth/react';
import { Poppins } from 'next/font/google';
import DashboardLayout from '@/layouts/DashboardLayout';
import Head from 'next/head';
import { Session } from 'next-auth';
import { ComponentType } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-poppins',
});

// Function to check if the current page is an auth page
const isAuthPage = (pathname: string): boolean => {
  return pathname === '/login' || pathname === '/register';
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
}: AppComponentProps): JSX.Element {
  const { session, ...restPageProps } = pageProps;
  const isAuth = isAuthPage(appRouter.pathname);
  const activePage = getActivePage(appRouter.pathname);

  return (
    <SessionProvider session={session}>
      <Head>
        <title>DigitSign - Assinatura Digital</title>
        <meta name="description" content="Sistema de assinatura digital de documentos" />
      </Head>
      <div className={poppins.variable}>
        <AnimatePresence mode="wait">
          {isAuth ? (
            <Component {...restPageProps} key={appRouter.pathname} />
          ) : (
            <DashboardLayout activePage={activePage}>
              <Component {...restPageProps} />
            </DashboardLayout>
          )}
        </AnimatePresence>
      </div>
      <Toaster />
    </SessionProvider>
  );
}
