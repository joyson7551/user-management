// app/layout.js
import "./globals.css";
import Navbar from "../components/Navbar";
import { AuthProvider } from "../components/AuthContext";
import AuthGuard from "../components/AuthGuard";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <div className="flex h-screen">
            <div className="w-64 bg-gray-800 text-white p-2">
              <h2 className="text-2xl text-cyan-50 font-bold mb-6 ">User-Management</h2>
              <Navbar />
            </div>
            <main className="flex-1 overflow-auto">{children}</main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}

