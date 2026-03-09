import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllUsers,
  deleteUser,
  updateUserRole,
  clearUserState,
} from "../../redux/slices/userSlice";
import Sidebar from "../../components/layout/Sidebar";
import toast from "react-hot-toast";
import { FiTrash2, FiShield, FiUser } from "react-icons/fi";

const ManageUsers = () => {
  const dispatch = useDispatch();
  const { users, loading, error, message } = useSelector((state) => state.users);
  const { user: currentUser } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearUserState());
    }
    if (message) {
      toast.success(message);
      dispatch(clearUserState());
    }
  }, [error, message, dispatch]);

  const handleDelete = async (id) => {
    if (id === currentUser?._id) {
      toast.error("You cannot delete your own account!");
      return;
    }
    if (window.confirm("Are you sure you want to delete this user?")) {
      dispatch(deleteUser(id));
    }
  };

  const handleRoleToggle = (id, currentRole) => {
    const newRole = currentRole === "admin" ? "member" : "admin";
    if (window.confirm(`Change this user's role to ${newRole}?`)) {
      dispatch(updateUserRole({ id, role: newRole }));
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">Manage Users</h1>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-sm">
                  <th className="px-6 py-4 text-left font-semibold">User</th>
                  <th className="px-6 py-4 text-left font-semibold">Email</th>
                  <th className="px-6 py-4 text-left font-semibold">Role</th>
                  <th className="px-6 py-4 text-left font-semibold">Verified</th>
                  <th className="px-6 py-4 text-left font-semibold">Joined</th>
                  <th className="px-6 py-4 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-indigo-100 rounded-full flex items-center justify-center">
                          <span className="text-indigo-600 font-semibold text-sm">
                            {u.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="font-medium text-gray-800">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{u.email}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          u.role === "admin"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          u.verified
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {u.verified ? "Verified" : "Pending"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(u.createdAt).toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {u._id !== currentUser?._id && (
                          <>
                            <button
                              onClick={() => handleRoleToggle(u._id, u.role)}
                              disabled={loading}
                              className="text-purple-600 hover:bg-purple-50 p-2 rounded-lg transition-colors"
                              title={u.role === "admin" ? "Demote to member" : "Promote to admin"}
                            >
                              {u.role === "admin" ? <FiUser /> : <FiShield />}
                            </button>
                            <button
                              onClick={() => handleDelete(u._id)}
                              disabled={loading}
                              className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                              title="Delete user"
                            >
                              <FiTrash2 />
                            </button>
                          </>
                        )}
                        {u._id === currentUser?._id && (
                          <span className="text-xs text-gray-400">(You)</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-10 text-gray-400">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
