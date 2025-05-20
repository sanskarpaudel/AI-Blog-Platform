// pages/edit/[id].js
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";

export default function EditPost() {
  const router = useRouter();
  const { id } = router.query;

  const [form, setForm] = useState({
    title: "",
    content: "",
    visibility: "public",
    tags: [],
  });
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (id) {
      fetch(`/api/posts/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setForm({
            title: data.title,
            content: data.content,
            visibility: data.visibility || "public",
            tags: data.tags || [],
          });
          setLoading(false);
        });
    }
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const tag = tagInput.trim();
      if (tag && !form.tags.includes(tag)) {
        setForm({ ...form, tags: [...form.tags, tag] });
        setTagInput("");
      }
    }
  };

  const handleDeleteTag = (tagToRemove) => {
    setForm({ ...form, tags: form.tags.filter((tag) => tag !== tagToRemove) });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const res = await fetch(`/api/posts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (res.ok) {
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        router.push("/dashboard");
      }, 2000);
    } else {
      alert("❌ Failed: " + data.message);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <>
      <Navbar />
      <main className="max-w-xl mx-auto mt-10 p-4 bg-white dark:bg-gray-800 shadow rounded relative">
        <h1 className="text-2xl font-bold text-blue-700 dark:text-blue-400 mb-4">
          Edit Post
        </h1>
        <form onSubmit={handleSave} className="space-y-4">
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-900 dark:text-white"
            required
          />

          <SimpleMDE
            value={form.content}
            onChange={(value) => setForm({ ...form, content: value })}
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
              {form.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 px-2 py-1 text-sm rounded cursor-pointer"
                  onClick={() => handleDeleteTag(tag)}
                  title="Click to remove"
                >
                  #{tag}
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
            Save Changes
          </button>
        </form>

        {/* ✅ Toast */}
        {showToast && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded shadow-lg z-50">
            ✅ Post updated and saved{" "}
            {form.visibility === "public" ? "publicly" : "privately"}!
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
