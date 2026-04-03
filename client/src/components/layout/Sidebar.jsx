import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  FileText,
  BarChart2,
} from "lucide-react";

const Sidebar = () => {
  const navItems = [
    { to: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/admin/books", icon: BookOpen, label: "Manage Books" },
    { to: "/admin/users", icon: Users, label: "Manage Users" },
    { to: "/admin/borrow-records", icon: FileText, label: "Borrow Records" },
    { to: "/admin/reports", icon: BarChart2, label: "Reports" },
  ];

  return (
    <aside className="w-64 bg-surface-100 min-h-screen border-r border-white/5">
      <div className="p-6">
        <h2 className="font-heading text-white font-bold text-lg mb-8">Admin Panel</h2>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-violet-600/20 to-indigo-600/20 text-violet-400 border border-violet-500/20"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium text-sm">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
