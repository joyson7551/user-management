'use client'
import AuthGuard from "@/components/AuthGuard";
import { useAuth } from "../components/AuthContext";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const { token } = useAuth();
  const router = useRouter();

  if (!token) {
    router.push("/login");
    return null;
  }

  return (
  <AuthGuard>
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Welcome to the Admin Dashboard</h1>
      <p>Select an option from the left menu to get started.</p>
    </div>
  </AuthGuard>
  );
}