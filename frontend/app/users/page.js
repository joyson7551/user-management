"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import AuthGuard from "@/components/AuthGuard";
import { useAuth } from "@/components/AuthContext";

export default function UsersPage() {
  const { token } = useAuth();
  const router = useRouter();

  // Initialize state unconditionally
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState("");

  // Load all users
  const fetchUsers = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch users");

      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
      setMessage("Error loading users.");
    }
  };

  // Fetch users on load
  useEffect(() => {
    fetchUsers();
  }, [token]);

  // Redirect to login if not authenticated
  if (!token) {
    router.push("/login");
    return null;
  }

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file selection
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // Submit form to add a new user
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("username", formData.username);
    if (selectedFile) {
      formDataToSend.append("photo", selectedFile);
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!res.ok) throw new Error("Failed to add user");

      await res.json();
      setMessage("✅ User added successfully!");
      setFormData({ name: "", email: "", username: "" });
      setSelectedFile(null);
      fetchUsers(); // Refresh user list
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to add user.");
    }
  };

  // Delete a user by ID
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to delete user");

      setMessage("✅ User deleted successfully!");
      fetchUsers(); // Refresh user list
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to delete user.");
    }
  };

  // Update a user by ID
  const handleEdit = async (user) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/${user}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(user),
        }
      );
      
       console.log(res)

      if (!res.ok) throw new Error("Failed to update user");

      setMessage("✅ User updated successfully!");
      fetchUsers(); // Refresh user list
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to update user.");
    }
  };

  return (
    <div className="p-6">
        <AuthGuard>
        <h2 className="text-xl font-bold mb-4">Manage Users</h2>

        {/* Form to add user */}
        <form
          onSubmit={handleSubmit}
          className="mb-6 bg-white p-4 rounded shadow-md"
        >
          <h3 className="font-semibold mb-2 text-black">Add New User</h3>
          <input
            type="text"
            name="name"
            placeholder="Name.."
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded mb-2 text-black"
          />
          <input
            type="email"
            name="email"
            placeholder="Email.."
            value={formData.email}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded mb-2 text-black"
          />
          <input
            type="text"
            name="username"
            placeholder="Username.."
            value={formData.username}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded mb-2 text-black"
          />
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full mb-2 text-black"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition w-full"
          >
            Add User
          </button>
          {message && <p className="mt-2 text-sm">{message}</p>}
        </form>

        {/* List of users */}
        {users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <ul className="space-y-4">
            {users.map((user) => (
              <li key={user._id} className="bg-white p-4 rounded shadow-md">
                <div className="flex justify-between items-start">
                  <div>
                    <strong>{user.name}</strong>
                    <p className="text-gray-500">{user.email}</p>
                    <p className="text-gray-500">{user.username}</p>
                    {user.photo && (
                      <div className="mt-2">
                        <img
                          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/${user.photo}`}
                          alt="User Photo"
                          className="h-24 w-auto rounded object-cover"
                        />
                      </div>
                    )}
                  </div>
                  <div className="space-x-2">
                    <button
                      onClick={() => handleEdit(user)}
                      className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
    </AuthGuard>
      </div>
  );
}
