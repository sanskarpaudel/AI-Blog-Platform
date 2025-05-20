import { connectDB } from "@/lib/mongodb";
import Post from "@/models/Post";

export default async function handler(req, res) {
  const { id } = req.query;

  await connectDB();

  if (req.method === "GET") {
    try {
      const post = await Post.findById(id);
      if (!post) return res.status(404).json({ message: "Post not found" });
      return res.status(200).json(post);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  if (req.method === "PUT") {
    try {
      const { title, content, visibility } = req.body;

      const updated = await Post.findByIdAndUpdate(
        id,
        {
          title,
          content,
          visibility, // ✅ make sure this is included
        },
        { new: true }
      );

      if (!updated)
        return res.status(404).json({ message: "Post not found to update" });

      return res.status(200).json(updated);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
