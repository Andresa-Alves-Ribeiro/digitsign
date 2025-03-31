import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Toaster } from "react-hot-toast";
import { SessionProvider } from "next-auth/react";
import { Poppins } from "next/font/google";
import DashboardLayout from "@/layouts/DashboardLayout";
import Header from "@/layouts/Header";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-poppins",
});

// Function to check if the current page is an auth page
const isAuthPage = (pathname: string) => {
  return pathname === "/login" || pathname === "/register";
};

// Function to determine the active page based on the pathname
const getActivePage = (pathname: string): 'dashboard' | 'upload' | 'pending' | 'signed' | 'documents' => {
  if (pathname === "/") return "dashboard";
  const path = pathname.split("/")[1];
  if (path === "documents") {
    const subPath = pathname.split("/")[2];
    if (subPath === "upload") return "upload";
    if (subPath === "pending") return "pending";
    if (subPath === "signed") return "signed";
    return "documents";
  }
  return "dashboard";
};

export default function App({ Component, pageProps: { session, ...pageProps }, router }: AppProps) {
  const isAuth = isAuthPage(router.pathname);
  const activePage = getActivePage(router.pathname);

  return (
    <SessionProvider session={session}>
      <div className={poppins.variable}>
        {isAuth ? (
          <Component {...pageProps} />
        ) : (
          <DashboardLayout activePage={activePage}>
            <div className="flex-1 flex flex-col h-screen">
              <Header activePage={activePage} />
              <main className="flex-1 bg-zinc-50 h-full">
                <Component {...pageProps} />
              </main>
            </div>
          </DashboardLayout>
        )}
      </div>
      <Toaster />
    </SessionProvider>
  );
}
