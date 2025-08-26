// import { useAuth } from "../components/AuthContext";
// import { useRouter } from "next/navigation";
// import { useState, useEffect } from "react";

// export default function AdminsPage() {
//   const { token } = useAuth();
//   const router = useRouter();

//   // Initialize state unconditionally
//   const [admins, setAdmins] = useState([]);
//   const [message, setMessage] = useState("");

//   // Load all admins
//   const fetchAdmins = async () => {
//     try {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin`);
//       if (!res.ok) throw new Error("Failed to fetch admins");

//       const data = await res.json();
//       setAdmins(data);
//     } catch (err) {
//       console.error(err);
//       setMessage("Error loading admins.");
//     }
//   };

//   // Fetch on component mount
//   useEffect(() => {
//     if (token) {
//       fetchAdmins();
//     }
//   }, [token]);

//   // Redirect to login if not authenticated
//   if (!token) {
//     router.push("/login");
//     return null;
//   }

//   return (
//     <div className="p-6">
//       <h2 className="text-xl font-bold mb-4">Admin List</h2>

//       {/* No admins message */}
//       {admins.length === 0 ? (
//         <p>No admins found.</p>
//       ) : (
//         <ul className="space-y-4">
//           {admins.map((admin) => (
//             <li key={admin._id} className="bg-white p-4 rounded shadow-md">
//               <strong>{admin.username}</strong>
//               <p className="text-gray-500">{admin.email}</p>
//             </li>
//           ))}
//         </ul>
//       )}

//       {message && <p className="mt-4 text-red-500">{message}</p>}
//     </div>
//   );
// }

// ============v2===========
// app/admins/page.js
'use client'
import { useAuth } from "@/components/AuthContext";
import AuthGuard from "@/components/AuthGuard";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function AdminsPage() {
  const { token } = useAuth();
  const router = useRouter();

  // Initialize state unconditionally
  const [admins, setAdmins] = useState([]);
  const [message, setMessage] = useState("");

  // Load all admins
const fetchAdmins = async () => {
  if (!token) {
    router.push("/login");
    return;
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch admins");
    }

    const data = await res.json();
    setAdmins(data);
  } catch (err) {
    console.error(err);
    setMessage("Error loading admins.");
  }
};

  // Fetch on component mount
  useEffect(() => {
    if (token) {
      fetchAdmins();
    }
  }, [token]);

  // Redirect to login if not authenticated
  if (!token) {
    router.push("/login");
    return null;
  }

  // Delete admin
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this admin?")) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete admin");

      setMessage("✅ Admin deleted successfully!");
      fetchAdmins(); // Refresh admin list
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to delete admin.");
    }
  };

  // Edit admin
  const handleEdit = async (admin) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/${admin._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(admin),
      });

      if (!res.ok) throw new Error("Failed to update admin");

      setMessage("✅ Admin updated successfully!");
      fetchAdmins(); // Refresh admin list
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to update admin.");
    }
  };

  return (
  <AuthGuard>
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Admin List</h2>

      {/* No admins message */}
      {admins.length === 0 ? (
        <p>No admins found.</p>
      ) : (
        <ul className="space-y-4">
          {admins.map((admin) => (
            <li key={admin._id} className="bg-white p-4 rounded shadow-md flex justify-between items-start">
              <div className="text-black">
                <strong>{admin.username}</strong>
                <p className="text-black">{admin.email}</p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => handleEdit(admin)}
                  className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(admin._id)}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {message && <p className="mt-4 text-sm">{message}</p>}
    </div>
    </AuthGuard>
  );
}