import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import {
  BookOpen,
  Users,
  Bell,
  ArrowRight,
  Sparkles,
  Shield,
  Zap,
  TrendingUp,
  Library,
  Star,
} from "lucide-react";

/* ─────────────── Animated Count Up ─────────────── */
const CountUp = ({ target, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
};

/* ─────────────── Glow Blob ─────────────── */
const GlowBlob = ({ className }) => (
  <div className={`absolute rounded-full blur-3xl opacity-20 animate-blob ${className}`} />
);

/* ─────────────── Section Wrapper ─────────────── */
const FadeInSection = ({ children, delay = 0, className = "" }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const Home = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const features = [
    {
      icon: BookOpen,
      title: "Smart Book Management",
      description:
        "Effortlessly add, update, and organize your entire library catalog with powerful search, filters, and AI-powered recommendations.",
      gradient: "from-violet-500 to-indigo-500",
      glow: "violet",
    },
    {
      icon: Users,
      title: "Member Tracking",
      description:
        "Keep track of all borrowed books, due dates, and return history for every member. Real-time dashboard insights at your fingertips.",
      gradient: "from-cyan-500 to-blue-500",
      glow: "cyan",
    },
    {
      icon: Bell,
      title: "Smart Notifications",
      description:
        "Automated email reminders for overdue books, fine calculations, and personalized reading recommendations powered by AI.",
      gradient: "from-amber-500 to-orange-500",
      glow: "amber",
    },
  ];

  const stats = [
    { value: 500, suffix: "+", label: "Books Available", icon: Library },
    { value: 200, suffix: "+", label: "Active Members", icon: Users },
    { value: 1000, suffix: "+", label: "Books Borrowed", icon: TrendingUp },
  ];

  const trustBadges = [
    { icon: Shield, label: "Secure" },
    { icon: Zap, label: "Fast" },
    { icon: Star, label: "Rated 4.9" },
    { icon: Sparkles, label: "AI Powered" },
  ];

  return (
    <div className="overflow-hidden">
      {/* ═══════════════ HERO SECTION ═══════════════ */}
      <section className="relative min-h-screen flex items-center justify-center">
        {/* Background */}
        <div className="absolute inset-0 bg-hero-gradient" />
        <GlowBlob className="w-96 h-96 bg-violet-600 top-1/4 -left-48" />
        <GlowBlob className="w-80 h-80 bg-cyan-600 bottom-1/4 -right-40 animation-delay-2000" />
        <GlowBlob className="w-64 h-64 bg-indigo-600 top-1/2 left-1/2 -translate-x-1/2 animation-delay-4000" />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-40">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm"
            >
              <Sparkles className="w-4 h-4 text-violet-400" />
              <span className="text-sm text-gray-300 font-medium">
                AI-Powered Library Management
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="font-heading text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight mb-7"
            >
              The Future of{" "}
              <span className="gradient-text">Library</span>
              <br />
              Management
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              A complete digital platform to manage your library seamlessly. Track books,
              manage members, automate notifications — all powered by intelligent AI.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              {isAuthenticated ? (
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    to={user?.role === "admin" ? "/admin/dashboard" : "/member/dashboard"}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-8 py-3.5 rounded-xl font-semibold hover:from-violet-500 hover:to-indigo-500 transition-all shadow-glow-violet text-base"
                  >
                    Go to Dashboard <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              ) : (
                <>
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Link
                      to="/register"
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-8 py-3.5 rounded-xl font-semibold hover:from-violet-500 hover:to-indigo-500 transition-all shadow-glow-violet text-base"
                    >
                      Get Started Free <ArrowRight className="w-4 h-4" />
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Link
                      to="/login"
                      className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-white/10 transition-all backdrop-blur-sm text-base"
                    >
                      Sign In
                    </Link>
                  </motion.div>
                </>
              )}
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/catalog"
                  className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-white/10 transition-all backdrop-blur-sm text-base"
                >
                  Browse Catalog
                </Link>
              </motion.div>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.7 }}
              className="flex flex-wrap items-center justify-center gap-6 mt-14"
            >
              {trustBadges.map((badge) => (
                <div
                  key={badge.label}
                  className="flex items-center gap-2 text-gray-500 text-sm"
                >
                  <badge.icon className="w-4 h-4 text-violet-400/60" />
                  <span>{badge.label}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-surface to-transparent" />
      </section>

      {/* ═══════════════ FEATURES SECTION ═══════════════ */}
      <section className="relative py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection className="text-center mb-16">
            <span className="inline-block text-sm font-semibold text-violet-400 tracking-wider uppercase mb-4">
              Features
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5">
              Everything You Need
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Powerful features designed for modern, efficient library management.
            </p>
          </FadeInSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <FadeInSection key={index} delay={index * 0.15}>
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="group relative glass-card p-8 lg:p-10 h-full"
                >
                  {/* Glow effect on hover */}
                  <div
                    className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${feature.gradient} blur-xl -z-10`}
                    style={{ transform: "scale(0.8)", opacity: 0 }}
                  />
                  <div
                    className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-[0.05] transition-opacity duration-500 bg-gradient-to-br ${feature.gradient}`}
                  />

                  <div
                    className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.gradient} mb-6 shadow-lg`}
                  >
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>

                  <h3 className="font-heading text-xl font-bold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed text-sm">
                    {feature.description}
                  </p>

                  <div className="mt-6 flex items-center gap-2 text-sm font-medium text-violet-400 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    Learn more <ArrowRight className="w-4 h-4" />
                  </div>
                </motion.div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ STATS SECTION ═══════════════ */}
      <section className="relative py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-surface via-surface-100 to-surface" />
        <GlowBlob className="w-72 h-72 bg-violet-600 top-0 left-1/4" />
        <GlowBlob className="w-72 h-72 bg-cyan-600 bottom-0 right-1/4" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection className="text-center mb-14">
            <span className="inline-block text-sm font-semibold text-cyan-400 tracking-wider uppercase mb-4">
              By the Numbers
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white">
              Trusted by Libraries Everywhere
            </h2>
          </FadeInSection>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <FadeInSection key={index} delay={index * 0.15}>
                <motion.div
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="glass-card p-8 text-center group"
                >
                  <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 mb-5 group-hover:from-violet-500/30 group-hover:to-cyan-500/30 transition-all">
                    <stat.icon className="w-6 h-6 text-violet-400" />
                  </div>
                  <div className="font-heading text-4xl lg:text-5xl font-bold text-white mb-2">
                    <CountUp target={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-gray-500 text-sm font-medium tracking-wide">
                    {stat.label}
                  </div>
                </motion.div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ CTA SECTION ═══════════════ */}
      <section className="relative py-24 lg:py-32">
        <GlowBlob className="w-96 h-96 bg-violet-600 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FadeInSection>
            <div className="glass-card p-12 lg:p-16">
              <span className="inline-block text-sm font-semibold text-violet-400 tracking-wider uppercase mb-4">
                Get Started Today
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5">
                Ready to Transform{" "}
                <span className="gradient-text">Your Library?</span>
              </h2>
              <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
                Join thousands of libraries already using SmartLibrary. Start your journey today — it&apos;s free.
              </p>

              {!isAuthenticated && (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-10 py-4 rounded-xl font-semibold hover:from-violet-500 hover:to-indigo-500 transition-all shadow-glow-violet text-lg group"
                  >
                    Create Free Account{" "}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
              )}

              <p className="text-xs text-gray-600 mt-6">
                No credit card required · Free forever · Setup in 2 minutes
              </p>
            </div>
          </FadeInSection>
        </div>
      </section>
    </div>
  );
};

export default Home;
