import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { FiBook, FiUsers, FiBell, FiArrowRight } from "react-icons/fi";

const Home = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const features = [
    {
      icon: <FiBook className="text-3xl text-indigo-600" />,
      title: "Manage Books",
      description: "Easily add, update, and organize your entire library catalog with powerful search and filter options.",
      bg: "bg-indigo-50",
    },
    {
      icon: <FiUsers className="text-3xl text-green-600" />,
      title: "Track Borrowing",
      description: "Keep track of all borrowed books, due dates, and return history for every member of your library.",
      bg: "bg-green-50",
    },
    {
      icon: <FiBell className="text-3xl text-amber-600" />,
      title: "Automated Notifications",
      description: "Send automatic email reminders for overdue books and fine calculations at ₹5 per day.",
      bg: "bg-amber-50",
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Smart Library <br />
              <span className="text-indigo-200">Management System</span>
            </h1>
            <p className="text-xl text-indigo-100 mb-10">
              A complete digital solution for managing your library. Track books, manage members,
              automate notifications — all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Link
                  to={user?.role === "admin" ? "/admin/dashboard" : "/member/dashboard"}
                  className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors flex items-center gap-2 justify-center"
                >
                  Go to Dashboard <FiArrowRight />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
                  >
                    Get Started
                  </Link>
                  <Link
                    to="/login"
                    className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition-colors"
                  >
                    Login
                  </Link>
                </>
              )}
              <Link
                to="/catalog"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition-colors"
              >
                Browse Catalog
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Everything You Need</h2>
          <p className="text-gray-500 mt-4 text-lg">
            Powerful features designed for efficient library management
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow"
            >
              <div className={`${feature.bg} inline-flex p-4 rounded-xl mb-6`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
              <p className="text-gray-500 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-indigo-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-indigo-200">Books Available</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">200+</div>
              <div className="text-indigo-200">Active Members</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">1000+</div>
              <div className="text-indigo-200">Books Borrowed</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          Ready to Get Started?
        </h2>
        <p className="text-gray-500 text-lg mb-8">
          Join our library today and explore thousands of books.
        </p>
        {!isAuthenticated && (
          <Link
            to="/register"
            className="bg-indigo-600 text-white px-10 py-4 rounded-xl font-semibold hover:bg-indigo-700 transition-colors text-lg inline-flex items-center gap-2"
          >
            Create Account <FiArrowRight />
          </Link>
        )}
      </section>
    </div>
  );
};

export default Home;
