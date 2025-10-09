import bcrypt from "bcryptjs";
import { connectDB } from "../db";
import { User } from "@/models/User";

export async function registerUser({
  username,
  email,
  password,
  role,
}: {
  username: string;
  email: string;
  password: string;
  role: "interviewee" | "interviewer";
}) {
  await connectDB();

  const existing = await User.findOne({ email });
  if (existing) throw new Error("User already exists");

  const hashed = await bcrypt.hash(password, 10);

  const newUser = new User({
    username,
    email,
    password: hashed,
    role,
  });

  await newUser.save();
  return {
    id: newUser._id.toString(),
    username: newUser.username,
    email: newUser.email,
    role: newUser.role,
  };
}

export async function authenticateUser(email: string, password: string) {
  await connectDB();
  const user = await User.findOne({ email });
  if (!user) return null;

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return null;

  return {
    id: user._id.toString(),
    username: user.username,
    email: user.email,
    role: user.role,
  };
}
