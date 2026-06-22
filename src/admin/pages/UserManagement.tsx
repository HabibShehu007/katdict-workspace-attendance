import { useState, useMemo } from "react";
import { Trash2, Eye, Loader2, Mail, User, Search, Shield } from "lucide-react";
import AdminDashboardLayout from "../layouts/AdminDashboardLayout";
import ConfirmationModal from "../components/modals/ConfirmationModal";
import UserDetailsModal from "../components/modals/UserDetailsModal";
import { useUsers, useDeleteUser } from "../hooks/user_hooks/useUsers";

const ROLE_MAP: Record<string, string> = {
  web_development: "Web Developer",
  ui_ux_design: "UI/UX Designer",
  networking: "Networking",
  data_science: "Data Scientist",
  admin: "Administrator",
};

export default function UserManagement() {
  const [userToDelete, setUserToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: users, isLoading } = useUsers();
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();

  const filteredUsers = useMemo(() => {
    if (!users || !Array.isArray(users)) return [];
    const query = searchQuery.toLowerCase();

    return users.filter((user: any) => {
      const name = (user.fullName || "").toLowerCase();
      const email = (user.email || "").toLowerCase();
      return name.includes(query) || email.includes(query);
    });
  }, [users, searchQuery]);

  const handleConfirmDelete = () => {
    if (userToDelete) {
      deleteUser(userToDelete.id, { onSuccess: () => setUserToDelete(null) });
    }
  };

  return (
    <AdminDashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
              Workspace Users
            </h1>
            <p className="text-zinc-500">
              Manage user access and workspace permissions.
            </p>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
          {isLoading ? (
            <div className="p-16 flex justify-center items-center">
              <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50/50 dark:bg-zinc-800/20 border-b border-zinc-100 dark:border-zinc-800">
                  <th className="px-8 py-5 text-[11px] font-black text-zinc-400 uppercase tracking-widest">
                    User
                  </th>
                  <th className="px-8 py-5 text-[11px] font-black text-zinc-400 uppercase tracking-widest">
                    Role
                  </th>
                  <th className="px-8 py-5 text-[11px] font-black text-zinc-400 uppercase tracking-widest">
                    Contact
                  </th>
                  <th className="px-8 py-5 text-[11px] font-black text-zinc-400 uppercase tracking-widest text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
                {filteredUsers.map((user: any) => (
                  <tr
                    key={user.id}
                    className="group hover:bg-emerald-50/30 dark:hover:bg-emerald-900/5 transition-colors duration-300"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500">
                          <User className="w-5 h-5" />
                        </div>
                        <p className="font-bold text-zinc-900 dark:text-white">
                          {user.fullName}
                        </p>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold border border-emerald-100 dark:border-emerald-900/50">
                        <Shield className="w-3 h-3" />
                        {ROLE_MAP[user.role] || "User"}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2.5 text-zinc-500 dark:text-zinc-400 text-sm">
                        <Mail className="w-4 h-4 opacity-70" />
                        {user.email}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-zinc-500 hover:text-emerald-600 transition-all"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            setUserToDelete({
                              id: user.id,
                              name: user.fullName,
                            })
                          }
                          className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-zinc-500 hover:text-red-600 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <ConfirmationModal
        isOpen={!!userToDelete}
        onClose={() => !isDeleting && setUserToDelete(null)}
        title="Remove User"
        message={`Are you sure you want to remove ${userToDelete?.name}?`}
        onConfirm={handleConfirmDelete}
      />
      <UserDetailsModal
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        user={
          selectedUser
            ? {
                id: selectedUser.id,
                fullName: selectedUser.fullName,
                email: selectedUser.email,
                role: selectedUser.role,
                currentStreak: selectedUser.currentStreak,
                highestStreak: selectedUser.highestStreak,
                createdAt: selectedUser.createdAt, // Passing the raw date/string
                bio: selectedUser.bio,
                avatarUrl: selectedUser.avatarUrl,
                isAdmin: selectedUser.role === "admin",
              }
            : null
        }
      />
    </AdminDashboardLayout>
  );
}
