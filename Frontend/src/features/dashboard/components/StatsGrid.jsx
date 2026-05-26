function StatsGrid({
  monitors,
}) {
  const healthy =
    monitors.filter(
      (m) => m.status === "UP"
    ).length;

  const down =
    monitors.length - healthy;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      <div className="bg-[#0B1220] border border-[#1E293B] rounded-2xl p-6">
        <p className="text-gray-400">
          Total Monitors
        </p>

        <h1 className="text-5xl font-bold mt-4">
          {monitors.length}
        </h1>
      </div>

      <div className="bg-[#0B1220] border border-[#1E293B] rounded-2xl p-6">
        <p className="text-gray-400">
          Healthy
        </p>

        <h1 className="text-5xl font-bold mt-4 text-green-400">
          {healthy}
        </h1>
      </div>

      <div className="bg-[#0B1220] border border-[#1E293B] rounded-2xl p-6">
        <p className="text-gray-400">
          Down
        </p>

        <h1 className="text-5xl font-bold mt-4 text-red-400">
          {down}
        </h1>
      </div>
    </div>
  );
}

export default StatsGrid;