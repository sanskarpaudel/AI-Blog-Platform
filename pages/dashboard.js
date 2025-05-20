import Head from "next/head";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Link from "next/link";
import Footer from "../components/Footer";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState("");

  useEffect(() => {
    if (session) {
      fetch("/api/get-posts")
        .then((res) => res.json())
        .then((data) => {
          setPosts(data);
          setFilteredPosts(data);
        });
    }
  }, [session]);

  useEffect(() => {
    let results = posts;

    if (search) {
      results = results.filter(
        (post) =>
          post.title.toLowerCase().includes(search.toLowerCase()) ||
          post.content.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (selectedTag) {
      results = results.filter((post) => post.tags?.includes(selectedTag));
    }

    setFilteredPosts(results);
  }, [search, selectedTag, posts]);

  if (status === "loading") return <p>Loading...</p>;
  if (!session)
    return <p className="text-center mt-10">Access Denied. Please login.</p>;

  const allTags = [...new Set(posts.flatMap((post) => post.tags || []))];

  return (
    <>
      <Head>
        <title>Your Dashboard | AI Blog Platform</title>
        <meta
          name="description"
          content="View and manage your AI-generated blog posts. Edit, delete, and organize by tags."
        />
        <meta property="og:title" content="Your Dashboard | AI Blog Platform" />
        <meta
          property="og:description"
          content="View and manage your AI-generated blog posts. Edit, delete, and organize by tags."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="http://localhost:3000/dashboard" />
      </Head>

      <Navbar />
      <main className="max-w-4xl mx-auto mt-10 p-4">
        <h1 className="text-3xl font-bold text-blue-700 mb-4">
          📚 Your Blog Posts
        </h1>

        <input
          type="text"
          placeholder="Search by title or content..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full mb-4 px-3 py-2 border rounded"
        />

        {allTags.length > 0 && (
          <div className="mb-4">
            <label className="block font-medium mb-1 text-gray-700">
              Filter by Tag
            </label>
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="">All Tags</option>
              {allTags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>

            {selectedTag && (
              <button
                onClick={() => setSelectedTag("")}
                className="mt-2 text-sm text-gray-500 underline"
              >
                Clear Tag Filter
              </button>
            )}
          </div>
        )}

        {filteredPosts.length === 0 ? (
          <p className="text-gray-600">No posts found.</p>
        ) : (
          <ul className="space-y-4">
            {filteredPosts.map((post) => (
              <li key={post._id} className="p-4 bg-white rounded shadow-md">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold text-blue-600 flex items-center gap-2">
                      {post.title}
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          post.visibility === "private"
                            ? "bg-red-100 text-red-600"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {post.visibility === "private"
                          ? "🔒 Private"
                          : "🌍 Public"}
                      </span>
                    </h2>
                    <p className="text-sm text-gray-500">
                      {new Date(post.createdAt).toLocaleString()}
                    </p>
                    <p className="text-gray-700 mt-2 line-clamp-3">
                      {post.content.slice(0, 150)}...
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {post.tags?.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-700 px-2 py-1 text-sm rounded"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 text-sm text-blue-600 ml-4">
                    <Link
                      href={`/posts/${post._id}`}
                      className="hover:underline"
                    >
                      View
                    </Link>
                    <Link
                      href={`/edit/${post._id}`}
                      className="hover:underline"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
      <Footer />
    </>
  );

  async function handleDelete(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (!confirmDelete) return;

    const res = await fetch(`/api/delete-post/${id}`, { method: "DELETE" });
    if (res.ok) {
      setPosts(posts.filter((post) => post._id !== id));
      alert("✅ Post deleted!");
    } else {
      alert("❌ Failed to delete post.");
    }
  }
}
