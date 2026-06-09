// src/admin/pages/UserManagement.tsx
import { useState } from "react";
import { Trash2, Eye, Loader2 } from "lucide-react";
import AdminDashboardLayout from "../layouts/AdminDashboardLayout";
import ConfirmationModal from "../components/modals/ConfirmationModal";
import { useUsers, useDeleteUser } from "../hooks/user_hooks/useUsers";

export default function UserManagement() {
  const [userToDelete, setUserToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const { data: users, isLoading } = useUsers();
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();

  const handleConfirmDelete = () => {
    if (userToDelete) {
      deleteUser(userToDelete.id, {
        onSuccess: () => setUserToDelete(null),
      });
    }
  };

  return (
    <AdminDashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* ... (Header remains the same) ... */}

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm">
          {isLoading ? (
            <div className="p-12 flex justify-center items-center">
              <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
            </div>
          ) : (
            <table className="w-full text-left">
              {/* ... (Table head remains the same) ... */}
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {users?.map((user: any) => (
                  <tr
                    key={user.id}
                    className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors"
                  >
                    <td className="px-6 py-4 font-bold text-zinc-900 dark:text-white">
                      {user.full_name}
                    </td>
                    <td className="px-6 py-4 text-zinc-500">{user.email}</td>
                    <td className="px-6 py-4 flex justify-end gap-2">
                      <button className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-500 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() =>
                          setUserToDelete({ id: user.id, name: user.full_name })
                        }
                        className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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
        message={`Are you sure you want to remove ${userToDelete?.name} from the Katdict workspace? This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        // You could pass isDeleting to your modal to show a loading state on the button
      />
    </AdminDashboardLayout>
  );
}
