import { FiBook, FiUsers, FiBell, FiShield, FiClock, FiSearch } from "react-icons/fi";

const About = () => {
  const features = [
    { icon: <FiBook />, title: "Book Management", desc: "Complete CRUD operations for library books with Cloudinary image upload support." },
    { icon: <FiUsers />, title: "User Management", desc: "Role-based access control with admin and member roles." },
    { icon: <FiBell />, title: "Email Notifications", desc: "Automated email notifications for OTP verification, borrowing, and overdue reminders." },
    { icon: <FiClock />, title: "Fine Calculation", desc: "Automatic fine calculation at ₹5 per day for overdue books." },
    { icon: <FiShield />, title: "Secure Authentication", desc: "JWT-based authentication with httpOnly cookies and OTP email verification." },
    { icon: <FiSearch />, title: "Advanced Search", desc: "Search books by title, author, or category with pagination support." },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Hero */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">About Smart Library</h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto">
          Smart Library Management System (SLMS) is a full-stack MERN application built as a BCA
          final year major project. It provides a complete digital solution for library management.
        </p>
      </div>

      {/* Tech Stack */}
      <div className="bg-indigo-600 text-white rounded-2xl p-10 mb-16">
        <h2 className="text-2xl font-bold mb-6 text-center">Technology Stack</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {["MongoDB", "Express.js", "React.js", "Node.js"].map((tech) => (
            <div key={tech} className="bg-white/10 rounded-xl p-4">
              <div className="text-xl font-bold">{tech}</div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center mt-4">
          {["Redux Toolkit", "Tailwind CSS", "JWT Auth", "Cloudinary"].map((tech) => (
            <div key={tech} className="bg-white/10 rounded-xl p-4">
              <div className="text-sm font-medium">{tech}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="text-indigo-600 text-2xl mb-3">{feature.icon}</div>
              <h3 className="font-bold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-gray-500 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Team */}
      <div className="bg-gray-50 rounded-2xl p-10 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Project Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-lg mx-auto">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <FiUsers className="text-indigo-600 text-2xl" />
            </div>
            <h3 className="font-bold text-gray-800">Aditya Pal</h3>
            <p className="text-gray-500 text-sm">230302010307</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <FiUsers className="text-indigo-600 text-2xl" />
            </div>
            <h3 className="font-bold text-gray-800">Kunal Panchal</h3>
            <p className="text-gray-500 text-sm">230302010367</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
