import Head from "next/head";
import Image from "next/image";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <Head>
        <title>AI Blog Platform | Create AI-Powered Blogs</title>
        <meta
          name="description"
          content="Write intelligent blog posts with AI suggestions. Create, edit, and share blogs with ease."
        />
        <meta property="og:title" content="AI Blog Platform" />
        <meta
          property="og:description"
          content="Write intelligent blog posts with AI suggestions. Create, edit, and share blogs with ease."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="http://localhost:3000/" />
      </Head>

      <Navbar />

      <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-center px-4">
        <div className="max-w-3xl" data-aos="fade-up" data-aos-delay="200">
          <h1 className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-4">
            Welcome to AI Blog Platform 🚀
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
            Create, edit, and get AI-powered blog suggestions in seconds.
          </p>

          {/* ✅ Optimized Hero Illustration with fade-in */}
          <div className="mb-6" data-aos="zoom-in" data-aos-delay="300">
            <Image
              src="/hero-illustration.svg"
              alt="AI Blog Hero"
              width={600}
              height={400}
              priority
            />
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
