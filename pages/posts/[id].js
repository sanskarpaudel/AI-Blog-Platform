// pages/posts/[id].js
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Head from "next/head";
import Navbar from "@/components/Navbar";
import Markdown from "react-markdown";

export default function PostDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [post, setPost] = useState(null);

  useEffect(() => {
    if (id) {
      fetch(`/api/posts/${id}`)
        .then((res) => res.json())
        .then((data) => setPost(data));
    }
  }, [id]);

  if (!post) return <p className="text-center mt-10">Loading...</p>;

  const description = post.content.slice(0, 150).replace(/\n/g, " ");
  const imageUrl = `http://localhost:3000/og-default.png`;

  return (
    <>
      <Head>
        <title>{post.title} | AI Blog</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:url" content={`http://localhost:3000/posts/${id}`} />
      </Head>

      <Navbar />
      <main className="max-w-3xl mx-auto mt-10 p-4">
        <h1 className="text-3xl font-bold text-blue-700 mb-4">{post.title}</h1>
        <p className="text-sm text-gray-500 mb-6">
          {new Date(post.createdAt).toLocaleString()}
        </p>
        <div className="prose max-w-none">
          <Markdown>{post.content}</Markdown>
        </div>
      </main>
    </>
  );
}
