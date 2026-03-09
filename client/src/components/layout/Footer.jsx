import { FiBook, FiGithub, FiMail } from "react-icons/fi";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-xl mb-4">
              <FiBook className="text-indigo-400" />
              Smart Library
            </div>
            <p className="text-sm text-gray-400">
              A complete Smart Library Management System built with the MERN stack for efficient library operations.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-indigo-400 transition-colors">Home</Link></li>
              <li><Link to="/catalog" className="hover:text-indigo-400 transition-colors">Book Catalog</Link></li>
              <li><Link to="/about" className="hover:text-indigo-400 transition-colors">About</Link></li>
              <li><Link to="/contact" className="hover:text-indigo-400 transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <FiMail className="text-indigo-400" />
                <span>library@example.com</span>
              </div>
              <div className="flex items-center gap-2">
                <FiGithub className="text-indigo-400" />
                <span>github.com/KunalDev69</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
          <p>© 2024 Smart Library Management System. Built by Aditya Pal & Kunal Panchal. MIT License.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
