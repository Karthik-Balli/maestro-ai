"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "interviewee",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // 🔹 Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // 🔹 Handle form submission
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Signup failed. Please try again.");
        return;
      }

      setSuccess(data.message);
      setTimeout(() => router.push("/login"), 1500); // redirect to login after success
    } catch (err: any) {
      console.error("Signup error:", err);
      setError("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <form
        onSubmit={handleSignup}
        className="bg-white shadow-lg rounded-xl p-8 w-full max-w-sm space-y-5 border border-gray-200"
      >
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Create Your Account
        </h2>

        {/* ✅ Success and Error messages */}
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        {success && <p className="text-green-600 text-sm text-center">{success}</p>}

        {/* Username */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">Username</label>
          <input
            name="username"
            type="text"
            placeholder="Choose a username"
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
            value={form.username}
            onChange={handleChange}
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">Email</label>
          <input
            name="email"
            type="email"
            placeholder="Enter your email"
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">Password</label>
          <input
            name="password"
            type="password"
            placeholder="Create a password"
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        {/* Role Selection */}
        <div className="flex justify-between items-center">
          <label className="text-sm text-gray-600">Role</label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
          >
            <option value="interviewee">Interviewee</option>
            <option value="interviewer">Interviewer</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full p-2 rounded-lg text-white font-medium transition-all duration-200 ${
            loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>

        {/* Navigation */}
        <p className="text-center text-sm text-gray-500 mt-2">
          Already have an account?{" "}
          <span
            onClick={() => router.push("/login")}
            className="text-blue-600 font-medium hover:underline cursor-pointer"
          >
            Log In
          </span>
        </p>
      </form>
    </div>
  );
}
