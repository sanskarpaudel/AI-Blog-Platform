export default function handler(req, res) {
  const token = process.env.HUGGINGFACE_API_KEY;
  if (!token) {
    return res.status(500).json({ error: "Token not found in env" });
  }
  return res.status(200).json({ message: "Token loaded correctly ✅" });
}
