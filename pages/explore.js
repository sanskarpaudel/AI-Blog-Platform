import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Head from "next/head";
import Link from "next/link";

export default function Explore() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;

  useEffect(() => {
    fetch(`/api/public-posts?page=${page}&limit=${limit}`)
      .then((res) => res.json())
      .then((data) => {
        setPosts(data.posts || []);
        setTotalPages(data.totalPages || 1);
      });
  }, [page]);

  const handleShare = (post) => {
    const postUrl = `${window.location.origin}/posts/${post._id}`;

    if (navigator.share) {
      navigator
        .share({
          title: post.title,
          text: post.content.slice(0, 100),
          url: postUrl,
        })
        .then(() => console.log("✅ Shared successfully"))
        .catch((err) => console.error("❌ Share failed", err));
    } else {
      navigator.clipboard
        .writeText(postUrl)
        .then(() => alert("✅ Link copied to clipboard!"))
        .catch(() => alert("❌ Failed to copy link"));
    }
  };

  return (
    <>
      <Head>
        <title>Explore Blogs | AI Blog Platform</title>
        <meta
          name="description"
          content="Explore the latest AI-generated blogs created by users on our platform."
        />
      </Head>

      <Navbar />

      <main className="max-w-4xl mx-auto mt-10 p-4 text-gray-800 dark:text-gray-100">
        <h1 className="text-3xl font-bold mb-6 text-blue-700 dark:text-blue-400 text-center">
          🌍 Explore Public Blogs
        </h1>

        {posts.length === 0 ? (
          <p className="text-center text-gray-500">No blogs found.</p>
        ) : (
          <ul className="space-y-6">
            {posts.map((post) => (
              <li
                key={post._id}
                className="p-5 rounded-lg shadow-md bg-white dark:bg-gray-800"
              >
                <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-2">
                  {post.title}
                </h2>
                <p className="text-sm text-gray-500 mb-2">
                  {new Date(post.createdAt).toLocaleString()}
                </p>
                <p className="line-clamp-3 mb-2">
                  {post.content.slice(0, 150)}...
                </p>
                <div className="flex flex-wrap gap-2 mb-2">
                  {post.tags?.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-sm bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex justify-between items-center mt-3">
                  <Link
                    href={`/posts/${post._id}`}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Read more →
                  </Link>
                  <button
                    onClick={() => handleShare(post)}
                    className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600"
                  >
                    🔗 Share
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Pagination */}
        <div className="flex justify-center mt-10 space-x-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className={`px-4 py-2 rounded ${
              page === 1
                ? "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            ← Previous
          </button>
          <span className="text-sm mt-2">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className={`px-4 py-2 rounded ${
              page === totalPages
                ? "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            Next →
          </button>
        </div>
      </main>

      <Footer />
    </>
  );
}
