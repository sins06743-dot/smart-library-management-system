import { useState } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send, MessageSquare, Clock } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Message sent successfully! We'll get back to you soon.");
      setFormData({ name: "", email: "", message: "" });
    }, 1500);
  };

  const contactInfo = [
    { icon: Mail, label: "Email", value: "library@smartlms.com" },
    { icon: Phone, label: "Phone", value: "+91 98765 43210" },
    { icon: MapPin, label: "Address", value: "Library Building, Campus Road" },
  ];

  return (
    <div className="min-h-screen pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
            <MessageSquare className="w-4 h-4 text-violet-400" />
            <span className="text-sm text-gray-300 font-medium">Get in Touch</span>
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-white mb-4">
            Contact <span className="gradient-text">Us</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Have questions? We&apos;d love to hear from you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="glass-card p-8"
          >
            <h2 className="font-heading text-xl font-bold text-white mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Your name"
                  className="w-full px-4 py-2.5 bg-surface-200/80 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                  className="w-full px-4 py-2.5 bg-surface-200/80 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="Write your message..."
                  className="w-full px-4 py-2.5 bg-surface-200/80 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all resize-none"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-3 rounded-xl hover:from-violet-500 hover:to-indigo-500 transition-all font-semibold disabled:opacity-50 flex items-center justify-center gap-2 shadow-glow-sm"
              >
                <Send className="w-4 h-4" />
                {loading ? "Sending..." : "Send Message"}
              </motion.button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-6"
          >
            <div className="glass-card p-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-cyan-500/5" />
              <div className="relative z-10">
                <h2 className="font-heading text-xl font-bold text-white mb-6">Get in Touch</h2>
                <p className="text-gray-400 mb-6">
                  We&apos;re here to help! Reach out to us through any of the following channels.
                </p>
                <div className="space-y-4">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="p-2.5 rounded-lg bg-violet-500/10 border border-violet-500/20">
                        <info.icon className="w-4 h-4 text-violet-400" />
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">{info.label}</p>
                        <p className="text-white font-medium text-sm">{info.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="glass-card p-8">
              <h3 className="font-heading font-bold text-white mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" /> Library Hours
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Monday - Friday</span>
                  <span className="text-white font-medium">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Saturday</span>
                  <span className="text-white font-medium">10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Sunday</span>
                  <span className="text-red-400 font-medium">Closed</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
