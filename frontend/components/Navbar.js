'use client'
import Link from "next/link";
import { useAuth } from "./AuthContext";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { token, logout } = useAuth();
  const router = useRouter();

  if (!token) return null;

  return (
    <aside className="w-60 bg-gray-800 text-white h-screen p-4">
      <h2 className="text-xl font-bold mb-6 underline">Admin Dashboard</h2>
      <nav className="space-y-3">
        <Link href="/users" className="block py-2 px-4 rounded hover:bg-gray-700">  
          Add User / List Users
        </Link>
        <Link href="/admins" className="block py-2 px-4 rounded hover:bg-gray-700">
          Admins
        </Link>
        <button
          onClick={logout}
          className="block py-2 px-4 rounded hover:bg-gray-700 w-full text-left"
        >
          Logout
        </button>
      </nav>
    </aside>
  );
}