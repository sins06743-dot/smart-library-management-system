import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  BookOpen,
  Users,
  Bell,
  Shield,
  Clock,
  Search,
  Sparkles,
  Code2,
} from "lucide-react";

const FadeIn = ({ children, delay = 0, className = "" }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const About = () => {
  const features = [
    { icon: BookOpen, title: "Book Management", desc: "Complete CRUD operations for library books with Cloudinary image upload support.", gradient: "from-violet-500 to-indigo-500" },
    { icon: Users, title: "User Management", desc: "Role-based access control with admin and member roles.", gradient: "from-cyan-500 to-blue-500" },
    { icon: Bell, title: "Email Notifications", desc: "Automated email notifications for OTP verification, borrowing, and overdue reminders.", gradient: "from-amber-500 to-orange-500" },
    { icon: Clock, title: "Fine Calculation", desc: "Automatic fine calculation at ₹5 per day for overdue books.", gradient: "from-rose-500 to-pink-500" },
    { icon: Shield, title: "Secure Authentication", desc: "JWT-based authentication with httpOnly cookies and OTP email verification.", gradient: "from-emerald-500 to-green-500" },
    { icon: Search, title: "Advanced Search", desc: "Search books by title, author, or category with pagination support.", gradient: "from-purple-500 to-violet-500" },
  ];

  const techStack = [
    { name: "MongoDB", desc: "Database" },
    { name: "Express.js", desc: "Backend" },
    { name: "React.js", desc: "Frontend" },
    { name: "Node.js", desc: "Runtime" },
  ];

  const extraTech = ["Redux Toolkit", "Tailwind CSS", "JWT Auth", "Cloudinary"];

  return (
    <div className="min-h-screen pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-violet-400" />
            <span className="text-sm text-gray-300 font-medium">About the Project</span>
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-white mb-5">
            About <span className="gradient-text">Smart Library</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Smart Library Management System (SLMS) is a full-stack MERN application built as a BCA
            final year major project. It provides a complete digital solution for library management.
          </p>
        </motion.div>

        {/* Tech Stack */}
        <FadeIn className="mb-16">
          <div className="glass-card p-10 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-cyan-500/5" />
            <div className="relative z-10">
              <div className="flex items-center justify-center gap-2 mb-6">
                <Code2 className="w-5 h-5 text-cyan-400" />
                <h2 className="font-heading text-2xl font-bold text-white">Technology Stack</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {techStack.map((tech) => (
                  <div key={tech.name} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center hover:bg-white/10 transition-all">
                    <div className="text-lg font-bold text-white">{tech.name}</div>
                    <div className="text-xs text-gray-500 mt-1">{tech.desc}</div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {extraTech.map((tech) => (
                  <div key={tech} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center hover:bg-white/10 transition-all">
                    <div className="text-sm font-medium text-gray-300">{tech}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Features */}
        <FadeIn className="mb-16">
          <div className="text-center mb-8">
            <span className="inline-block text-sm font-semibold text-violet-400 tracking-wider uppercase mb-3">Features</span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white">Key Features</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <FadeIn key={index} delay={index * 0.1}>
                <motion.div
                  whileHover={{ y: -4, scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="glass-card p-6 h-full group"
                >
                  <div className={`inline-flex p-2.5 rounded-lg bg-gradient-to-br ${feature.gradient} mb-4`}>
                    <feature.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-heading font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </FadeIn>

        {/* Team */}
        <FadeIn>
          <div className="glass-card p-10 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-indigo-500/5" />
            <div className="relative z-10">
              <h2 className="font-heading text-2xl font-bold text-white mb-8">Project Team</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-lg mx-auto">
                {[
                  { name: "Aditya Pal", id: "230302010307" },
                  { name: "Kunal Panchal", id: "230302010367" },
                ].map((member) => (
                  <motion.div
                    key={member.name}
                    whileHover={{ y: -4 }}
                    className="bg-white/5 border border-white/10 rounded-xl p-6"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-violet-500/20 to-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Users className="w-6 h-6 text-violet-400" />
                    </div>
                    <h3 className="font-bold text-white">{member.name}</h3>
                    <p className="text-gray-500 text-sm">{member.id}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
};

export default About;
