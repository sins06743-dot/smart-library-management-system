import { NavLink } from "react-router-dom";
import {
  FiGrid,
  FiBook,
  FiUsers,
  FiFileText,
  FiBarChart2,
} from "react-icons/fi";

// Admin sidebar navigation
const Sidebar = () => {
  const navItems = [
    { to: "/admin/dashboard", icon: <FiGrid />, label: "Dashboard" },
    { to: "/admin/books", icon: <FiBook />, label: "Manage Books" },
    { to: "/admin/users", icon: <FiUsers />, label: "Manage Users" },
    { to: "/admin/borrow-records", icon: <FiFileText />, label: "Borrow Records" },
    { to: "/admin/reports", icon: <FiBarChart2 />, label: "Reports" },
  ];

  return (
    <aside className="w-64 bg-gray-900 min-h-screen text-gray-300">
      <div className="p-6">
        <h2 className="text-white font-bold text-lg mb-8">Admin Panel</h2>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-indigo-600 text-white"
                    : "hover:bg-gray-800 text-gray-300"
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
