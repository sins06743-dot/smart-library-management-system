import { BookOpen, Globe, Mail, MessageCircle, Briefcase, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";

const Footer = () => {
  const [email, setEmail] = useState("");

  const quickLinks = [
    { to: "/", label: "Home" },
    { to: "/catalog", label: "Book Catalog" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  const productLinks = [
    { to: "/register", label: "Get Started" },
    { to: "/login", label: "Sign In" },
    { to: "/catalog", label: "Browse Books" },
    { to: "/about", label: "How It Works" },
  ];

  const socialLinks = [
    { icon: Globe, href: "#", label: "Website" },
    { icon: MessageCircle, href: "#", label: "Twitter" },
    { icon: Briefcase, href: "#", label: "LinkedIn" },
    { icon: Mail, href: "mailto:library@example.com", label: "Email" },
  ];

  return (
    <footer className="relative mt-auto overflow-hidden">
      {/* Gradient top border */}
      <div className="h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />

      <div className="bg-surface-100/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Brand */}
            <div className="lg:col-span-1">
              <Link to="/" className="flex items-center gap-2.5 group mb-5">
                <div className="relative">
                  <div className="absolute inset-0 bg-violet-500/30 blur-lg rounded-full" />
                  <BookOpen className="relative w-6 h-6 text-violet-400" />
                </div>
                <span className="font-heading font-bold text-lg text-white">
                  Smart<span className="text-violet-400">Library</span>
                </span>
              </Link>
              <p className="text-sm text-gray-500 leading-relaxed mb-6">
                A complete intelligent library management platform built for the modern age. Track, manage, and discover books effortlessly.
              </p>
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 hover:text-violet-400 hover:border-violet-500/30 transition-all"
                    title={social.label}
                  >
                    <social.icon className="w-4 h-4" />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-sm font-heading font-semibold text-white mb-5 tracking-wider uppercase">
                Quick Links
              </h3>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-sm text-gray-500 hover:text-violet-400 transition-colors duration-300 flex items-center gap-2 group"
                    >
                      <span className="w-0 group-hover:w-2 h-px bg-violet-500 transition-all duration-300" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Product */}
            <div>
              <h3 className="text-sm font-heading font-semibold text-white mb-5 tracking-wider uppercase">
                Product
              </h3>
              <ul className="space-y-3">
                {productLinks.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-sm text-gray-500 hover:text-violet-400 transition-colors duration-300 flex items-center gap-2 group"
                    >
                      <span className="w-0 group-hover:w-2 h-px bg-violet-500 transition-all duration-300" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="text-sm font-heading font-semibold text-white mb-5 tracking-wider uppercase">
                Stay Updated
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Get notified about new features and book arrivals.
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/30 transition-all"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-3 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl text-white hover:from-violet-500 hover:to-indigo-500 transition-all"
                >
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="mt-14 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-600">
              © {new Date().getFullYear()} SmartLibrary. Crafted with precision. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">Privacy</a>
              <a href="#" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">Terms</a>
              <a href="#" className="text-xs text-gray-600 hover:text-gray-400 transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
