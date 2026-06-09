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
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-zinc-900 dark:text-white">
              Workspace Users
            </h1>
            <p className="text-zinc-500 text-sm">
              Manage user access and workspace permissions.
            </p>
          </div>

          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            />
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
          {isLoading ? (
            <div className="p-12 flex justify-center items-center">
              <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/20">
                    <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-wider">
                      User Details
                    </th>
                    <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-[10px] font-black text-zinc-400 uppercase tracking-wider text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user: any) => (
                      <tr
                        key={user.id}
                        className="group hover:bg-zinc-50 dark:hover:bg-zinc-800/20 transition-all duration-200"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                              <User className="w-4 h-4" />
                            </div>
                            <span className="font-bold text-zinc-900 dark:text-white">
                              {user.full_name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-zinc-500 text-sm">
                          <div className="flex items-center gap-2">
                            <Mail className="w-3.5 h-3.5 text-zinc-400" />
                            {user.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="inline-flex items-center gap-1">
                            <button
                              onClick={() => setSelectedUser(user)} // Trigger Modal
                              className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg text-zinc-400 transition-colors"
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
                              className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg text-zinc-400 hover:text-red-600 transition-colors"
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
                        className="px-6 py-12 text-center text-zinc-400 text-sm"
                      >
                        No users found matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
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
