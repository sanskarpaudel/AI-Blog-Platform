// pages/_app.js
import { SessionProvider } from "next-auth/react";
import Head from "next/head";
import "../styles/globals.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast"; // ✅ Toast support

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  useEffect(() => {
    AOS.init({ once: true });
  }, []);

  return (
    <SessionProvider session={session}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <title>AI Blog Platform</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Toaster position="top-right" reverseOrder={false} />{" "}
      {/* ✅ Toast Renderer */}
      <Component {...pageProps} />
    </SessionProvider>
  );
}
