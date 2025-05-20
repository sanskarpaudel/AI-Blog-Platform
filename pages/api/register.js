import { connectDB } from "../../lib/mongodb";
import User from "../../models/User";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { email, password } = req.body;

  try {
    await connectDB();

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "User already exists" });

    // 🔐 Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    const user = new User({ email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: "User created!" });
  } catch (err) {
    console.error("Registration error:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}
