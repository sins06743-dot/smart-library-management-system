// Reusable stats card component for dashboards
const DashboardCard = ({ title, count, icon, color, bgColor }) => {
  return (
    <div className={`${bgColor || "bg-white"} rounded-xl shadow-sm border border-gray-100 p-6 flex items-center gap-4`}>
      <div className={`${color || "bg-indigo-100 text-indigo-600"} p-3 rounded-lg text-2xl`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{count}</p>
      </div>
    </div>
  );
};

export default DashboardCard;
