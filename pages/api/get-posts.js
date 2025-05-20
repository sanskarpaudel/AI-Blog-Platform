// pages/api/get-posts.js
import { connectDB } from "../../lib/mongodb";
import Post from "../../models/Post";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  await connectDB();
  const session = await getServerSession(req, res, authOptions);

  if (!session) return res.status(401).json({ message: "Unauthorized" });

  try {
    const posts = await Post.find({ author: session.user.email }).sort({
      createdAt: -1,
    });
    return res.status(200).json(posts);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}
