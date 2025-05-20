import { useSession } from "next-auth/react";
import { useState } from "react";
import Navbar from "../components/Navbar";
import { useRouter } from "next/router";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import Footer from "../components/Footer";
import toast from "react-hot-toast"; // ✅ Toast library

export default function CreatePost() {
  const { data: session } = useSession();
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    content: "",
    visibility: "public",
  });
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);

  if (!session)
    return (
      <p className="text-center mt-10">
        You must be logged in to create a post.
      </p>
    );

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/create-post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, tags }),
    });
    const data = await res.json();
    if (res.ok) {
      toast.success(
        `✅ Blog published ${
          form.visibility === "public" ? "publicly" : "privately"
        }!`
      );
      router.push("/dashboard");
    } else {
      toast.error(data.message || "Error creating post.");
    }
  };

  const handleGenerateAI = async () => {
    if (!form.title.trim())
      return toast.error("Please enter a blog title first.");
    setLoading(true);
    try {
      const res = await fetch("/api/generate-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: form.title }),
      });

      const data = await res.json();
      if (res.ok) {
        setForm({ ...form, content: data.content });
      } else {
        toast.error("Failed to generate content: " + data.message);
      }
    } catch (err) {
      toast.error("Error calling AI");
    } finally {
      setLoading(false);
    }
  };

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const tag = tagInput.trim();
      if (tag && !tags.includes(tag)) {
        setTags([...tags, tag]);
        setTagInput("");
      }
    }
  };

  return (
    <>
      <Navbar />
      <main className="max-w-xl mx-auto mt-10 p-4 bg-white dark:bg-gray-800 shadow-md rounded">
        <h1 className="text-2xl font-bold mb-4 text-blue-600 dark:text-blue-400">
          Create New Post
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Post Title"
            value={form.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-900 dark:text-white"
            required
          />

          <button
            type="button"
            onClick={handleGenerateAI}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
            disabled={loading}
          >
            {loading ? "Generating..." : "✨ Generate with AI"}
          </button>

          <SimpleMDE
            value={form.content}
            onChange={(value) => setForm({ ...form, content: value })}
            options={{ placeholder: "Write your blog post..." }}
          />

          {/* Tags Input */}
          <div>
            <label className="block font-medium text-gray-700 dark:text-gray-200">
              Tags
            </label>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
              placeholder="Type a tag and press Enter"
              className="w-full px-3 py-2 border rounded mt-1 bg-white dark:bg-gray-900 dark:text-white"
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 px-2 py-1 text-sm rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Visibility Select */}
          <div>
            <label className="block font-medium text-gray-700 dark:text-gray-200 mb-1">
              Visibility
            </label>
            <select
              name="visibility"
              value={form.visibility}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-900 dark:text-white"
            >
              <option value="public">🌍 Public</option>
              <option value="private">🔒 Private</option>
            </select>
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Publish
          </button>
        </form>
      </main>
      <Footer />
    </>
  );
}
