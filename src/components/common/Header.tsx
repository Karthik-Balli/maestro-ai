"use client";
import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full bg-white shadow-sm">
      <div className="container mx-auto p-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-blue-600">AI Interview Assistant</Link>
        <nav className="flex gap-4">
          <Link href="/resume" className="text-gray-700 hover:text-blue-600">Resume</Link>
          <Link href="/interview" className="text-gray-700 hover:text-blue-600">Interview</Link>
          <Link href="/interviewer" className="text-gray-700 hover:text-blue-600">Dashboard</Link>
        </nav>
      </div>
    </header>
  );
}
