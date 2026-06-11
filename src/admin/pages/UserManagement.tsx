// src/admin/pages/UserManagement.tsx
import { useState, useMemo } from "react";
import { Trash2, Eye, Loader2, Mail, User, Search } from "lucide-react";
import AdminDashboardLayout from "../layouts/AdminDashboardLayout";
import ConfirmationModal from "../components/modals/ConfirmationModal";
import UserDetailsModal from "../components/modals/UserDetailsModal"; // Import your new modal
import { useUsers, useDeleteUser } from "../hooks/user_hooks/useUsers";

export default function UserManagement() {
  const [userToDelete, setUserToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null); // State for viewing details
  const [searchQuery, setSearchQuery] = useState("");

  const { data: users, isLoading } = useUsers();
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();

  const filteredUsers = useMemo(() => {
    if (!users) return [];
    return users.filter((user: any) => {
      return (
        user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
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
        {/* Header Section */}
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

        {/* Improved Table Container */}
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
                    Contact
                  </th>
                  <th className="px-8 py-5 text-[11px] font-black text-zinc-400 uppercase tracking-widest text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user: any) => (
                    <tr
                      key={user.id}
                      className="group hover:bg-emerald-50/30 dark:hover:bg-emerald-900/5 transition-colors duration-300"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 group-hover:bg-emerald-100 group-hover:text-emerald-600 dark:group-hover:bg-emerald-900/40 dark:group-hover:text-emerald-400 transition-all">
                            <User className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-bold text-zinc-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                              {user.full_name}
                            </p>
                          </div>
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
                            className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-500 hover:text-emerald-600 transition-all"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              setUserToDelete({
                                id: user.id,
                                name: user.full_name,
                              })
                            }
                            className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 hover:bg-red-50 dark:hover:bg-red-900/20 text-zinc-500 hover:text-red-600 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-8 py-16 text-center text-zinc-400"
                    >
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!userToDelete}
        onClose={() => !isDeleting && setUserToDelete(null)}
        title="Remove User"
        message={`Are you sure you want to remove ${userToDelete?.name} from the Katdict workspace?`}
        onConfirm={handleConfirmDelete}
      />

      {/* User Details Modal */}
      <UserDetailsModal
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        user={selectedUser}
      />
    </AdminDashboardLayout>
  );
}
