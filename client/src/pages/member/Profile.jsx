import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadUser } from "../../redux/slices/authSlice";
import api from "../../utils/api";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { User, Mail, Pencil, Save, X } from "lucide-react";

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
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-heading text-2xl font-bold text-white mb-8">My Profile</h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass-card overflow-hidden"
        >
          {/* Profile Header */}
          <div className="relative p-8 text-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-cyan-500/10" />
            <div className="relative z-10">
              <div className="w-24 h-24 bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl font-bold text-white">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <h2 className="font-heading text-xl font-bold text-white">{user?.name}</h2>
              <p className="text-gray-400 capitalize">{user?.role}</p>
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-semibold text-gray-300">Profile Information</h3>
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-2 text-violet-400 hover:text-violet-300 text-sm font-medium transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5" /> Edit
                </button>
              ) : (
                <button
                  onClick={() => { setEditing(false); setFormData({ name: user.name, email: user.email }); }}
                  className="flex items-center gap-2 text-gray-500 hover:text-gray-300 text-sm transition-colors"
                >
                  <X className="w-3.5 h-3.5" /> Cancel
                </button>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-500 mb-1 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-violet-400" /> Full Name
                </label>
                {editing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-surface-200/80 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all"
                  />
                ) : (
                  <p className="text-white font-medium py-2">{user?.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-500 mb-1 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-violet-400" /> Email
                </label>
                <p className="text-white font-medium py-2">{user?.email}</p>
              </div>

              <div>
                <label className="block text-sm text-gray-500 mb-1">Role</label>
                <span
                  className={`text-sm font-semibold px-3 py-1 rounded-full capitalize ${
                    user?.role === "admin"
                      ? "bg-violet-500/10 text-violet-400 border border-violet-500/20"
                      : "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                  }`}
                >
                  {user?.role}
                </span>
              </div>

              <div>
                <label className="block text-sm text-gray-500 mb-1">Member Since</label>
                <p className="text-white font-medium">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" }) : "N/A"}
                </p>
              </div>
            </div>

            {editing && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                disabled={loading}
                className="mt-6 bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-6 py-2.5 rounded-xl hover:from-violet-500 hover:to-indigo-500 transition-all font-medium flex items-center gap-2 disabled:opacity-50 shadow-glow-sm"
              >
                <Save className="w-4 h-4" />
                {loading ? "Saving..." : "Save Changes"}
              </motion.button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
