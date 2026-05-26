function Topbar() {
  return (
    <div className="flex items-center justify-between mb-10">
      <div>
        <h1 className="text-4xl font-bold">
          Dashboard
        </h1>

        <p className="text-gray-400 mt-2">
          Monitor everything in realtime
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="bg-[#0B1220] border border-[#1E293B] px-5 py-3 rounded-xl">
          <span className="text-green-400">
            ● System Active
          </span>
        </div>

        <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center font-bold">
          V
        </div>
      </div>
    </div>
  );
}

export default Topbar;