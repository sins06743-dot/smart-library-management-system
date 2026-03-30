const ReadingHeatmap = ({ streakData = {} }) => {
  const today = new Date();
  const oneYearAgo = new Date(today);
  // Use 364 days (52 full weeks) to keep the grid aligned to week boundaries
  oneYearAgo.setDate(today.getDate() - 364);

  // Build 52 weeks of days
  const weeks = [];
  const startDate = new Date(oneYearAgo);
  // Adjust to start on Sunday
  startDate.setDate(startDate.getDate() - startDate.getDay());

  let currentDate = new Date(startDate);
  while (currentDate <= today) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      const dateStr = currentDate.toISOString().split("T")[0];
      const count = streakData[dateStr] || 0;
      week.push({ date: dateStr, count });
      currentDate.setDate(currentDate.getDate() + 1);
    }
    weeks.push(week);
  }

  const getColor = (count) => {
    if (count === 0) return "bg-gray-100";
    if (count === 1) return "bg-green-200";
    if (count <= 3) return "bg-green-400";
    return "bg-green-600";
  };

  const months = [];
  let lastMonth = -1;
  weeks.forEach((week, wi) => {
    const month = new Date(week[0].date).getMonth();
    if (month !== lastMonth) {
      months.push({ index: wi, name: new Date(week[0].date).toLocaleString("default", { month: "short" }) });
      lastMonth = month;
    }
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <h3 className="font-bold text-gray-800 mb-4">Reading Activity (Last 365 Days)</h3>
      <div className="overflow-x-auto">
        <div className="relative" style={{ minWidth: `${weeks.length * 14}px` }}>
          {/* Month labels */}
          <div className="flex mb-1" style={{ height: "16px" }}>
            {weeks.map((_, wi) => {
              const monthEntry = months.find((m) => m.index === wi);
              return (
                <div key={wi} className="w-3 mr-0.5 flex-shrink-0">
                  {monthEntry && (
                    <span className="text-xs text-gray-400 absolute" style={{ left: `${wi * 14}px` }}>
                      {monthEntry.name}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
          {/* Day labels + grid */}
          <div className="flex gap-0.5">
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-0.5">
                {week.map((day) => (
                  <div
                    key={day.date}
                    title={`${day.date}: ${day.count} borrow${day.count !== 1 ? "s" : ""}`}
                    className={`w-3 h-3 rounded-sm ${getColor(day.count)} cursor-default`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Legend */}
      <div className="flex items-center gap-2 mt-3">
        <span className="text-xs text-gray-400">Less</span>
        {["bg-gray-100", "bg-green-200", "bg-green-400", "bg-green-600"].map((c) => (
          <div key={c} className={`w-3 h-3 rounded-sm ${c}`} />
        ))}
        <span className="text-xs text-gray-400">More</span>
      </div>
    </div>
  );
};

export default ReadingHeatmap;
