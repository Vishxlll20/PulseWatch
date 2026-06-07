import React, { useState, useEffect } from "react";
import { HiOutlineTrash, HiOutlineRefresh, HiOutlineSearch } from "react-icons/hi";
import adminService from "../../service/adminService";
import toast from "react-hot-toast";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await adminService.getUsers();
      setUsers(data);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const removeUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user? All their monitors will also be affected.")) {
      try {
        await adminService.deleteUser(id);
        setUsers(users.filter((user) => user._id !== id));
        toast.success("User deleted successfully");
      } catch {
        toast.error("Failed to delete user");
      }
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8" style={{ backgroundColor: "#FAF9F6" }}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1a0e08]">Users</h1>
            <p className="text-[#1a0e08]/50 text-sm mt-0.5">Manage platform users</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchUsers}
              className="p-2 rounded-xl bg-white/50 border border-[#1a0e08]/8 text-[#1a0e08]/50 hover:bg-white transition-colors"
            >
              <HiOutlineRefresh className="text-lg" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-4">
          <div className="relative max-w-md">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#1a0e08]/40 text-sm" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users by name or email..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/50 border border-[#1a0e08]/8 text-sm text-[#1a0e08] placeholder:text-[#1a0e08]/40 focus:outline-none focus:ring-2 focus:ring-[#1a0e08]/20 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Users List Container */}
      <div className="bg-white/30 backdrop-blur-sm rounded-2xl border border-[#1a0e08]/8 overflow-hidden">
        {/* Desktop Table Header */}
        <div className="hidden md:grid md:grid-cols-12 gap-4 px-4 py-3 bg-white/20 border-b border-[#1a0e08]/8 text-xs font-semibold text-[#1a0e08]/50 uppercase tracking-wider">
          <div className="md:col-span-4 pl-2">Username</div>
          <div className="md:col-span-4">Email</div>
          <div className="md:col-span-3">Joined</div>
          <div className="md:col-span-1 text-center">Actions</div>
        </div>

        {/* List Items */}
        {loading ? (
          <div className="text-center py-12 text-[#1a0e08]/40">Loading users...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-12 text-[#1a0e08]/40">No users found.</div>
        ) : (
          <div>
            {filteredUsers.map((user) => (
              <div key={user._id} className="grid grid-cols-1 md:grid-cols-12 gap-4 px-4 py-4 items-center border-b border-[#1a0e08]/5 hover:bg-white/30 transition-colors">
                <div className="md:col-span-4 flex items-center gap-3 pl-2">
                  <div className="w-8 h-8 rounded-full bg-[#1a0e08]/5 flex items-center justify-center font-bold text-[#1a0e08] text-xs">
                    {user.username.substring(0, 2).toUpperCase()}
                  </div>
                  <span className="font-medium text-[#1a0e08] text-sm">{user.username}</span>
                </div>
                <div className="md:col-span-4 text-sm text-[#1a0e08]/60 truncate">
                  {user.email}
                </div>
                <div className="md:col-span-3 text-sm text-[#1a0e08]/60">
                  {new Date(user.createdAt).toLocaleDateString()}
                </div>
                <div className="md:col-span-1 text-center">
                  <button
                    onClick={() => removeUser(user._id)}
                    className="text-[#1a0e08]/30 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50"
                  >
                    <HiOutlineTrash className="text-base" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
