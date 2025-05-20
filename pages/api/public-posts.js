// pages/api/public-posts.js
import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";

export default async function handler(req, res) {
  const { page = 1, limit = 5 } = req.query;

  try {
    await connectDB();

    const skip = (page - 1) * limit;
    const posts = await Post.find({ visibility: "public" }) // ✅ Only public
      .sort({ createdAt: -1 })
      .skip(Number(skip))
      .limit(Number(limit));

    const total = await Post.countDocuments({ visibility: "public" });

    return res.status(200).json({
      posts,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}
