import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadUser } from "../../redux/slices/authSlice";
import api from "../../utils/api";
import toast from "react-hot-toast";
import { FiUser, FiMail, FiEdit2, FiSave, FiX } from "react-icons/fi";

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name, email: user.email });
    }
  }, [user]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.put(`/users/${user._id}/profile`, formData);
      await dispatch(loadUser());
      toast.success("Profile updated successfully!");
      setEditing(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-8">My Profile</h1>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white text-center">
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <h2 className="text-xl font-bold">{user?.name}</h2>
          <p className="text-indigo-200 capitalize">{user?.role}</p>
        </div>

        {/* Profile Details */}
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-gray-700">Profile Information</h3>
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 text-sm font-medium"
              >
                <FiEdit2 /> Edit
              </button>
            ) : (
              <button
                onClick={() => { setEditing(false); setFormData({ name: user.name, email: user.email }); }}
                className="flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm"
              >
                <FiX /> Cancel
              </button>
            )}
          </div>

          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm text-gray-500 mb-1 flex items-center gap-1">
                <FiUser className="text-indigo-400" /> Full Name
              </label>
              {editing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              ) : (
                <p className="text-gray-800 font-medium py-2">{user?.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm text-gray-500 mb-1 flex items-center gap-1">
                <FiMail className="text-indigo-400" /> Email
              </label>
              <p className="text-gray-800 font-medium py-2">{user?.email}</p>
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm text-gray-500 mb-1">Role</label>
              <span
                className={`text-sm font-semibold px-3 py-1 rounded-full capitalize ${
                  user?.role === "admin"
                    ? "bg-purple-100 text-purple-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {user?.role}
              </span>
            </div>

            {/* Member since */}
            <div>
              <label className="block text-sm text-gray-500 mb-1">Member Since</label>
              <p className="text-gray-800 font-medium">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" }) : "N/A"}
              </p>
            </div>
          </div>

          {editing && (
            <button
              onClick={handleSave}
              disabled={loading}
              className="mt-6 bg-indigo-600 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center gap-2 disabled:opacity-50"
            >
              <FiSave />
              {loading ? "Saving..." : "Save Changes"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
