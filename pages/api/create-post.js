import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    await connectDB();

    const session = await getServerSession(req, res, authOptions);
    if (!session) return res.status(401).json({ message: "Unauthorized" });

    const { title, content, tags, visibility } = req.body;

    const post = new Post({
      title,
      content,
      tags: tags || [],
      author: session.user.email,
      visibility: visibility || "public", // ✅ Default to public if not provided
    });

    await post.save();

    console.log("✅ Saved post:", {
      title: post.title,
      content: post.content.slice(0, 100) + "...",
      author: post.author,
      tags: post.tags,
      visibility: post.visibility,
    });

    res.status(201).json({ message: "Post created!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}
