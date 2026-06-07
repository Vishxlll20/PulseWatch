const statusBadge = (status) => {
  if (status === "up")
    return (
      <span className="text-xs px-2.5 py-1 rounded-full bg-teal-50 text-teal-700 font-medium">
        Up
      </span>
    );
  if (status === "down")
    return (
      <span className="text-xs px-2.5 py-1 rounded-full bg-red-50 text-red-700 font-medium">
        Down
      </span>
    );
  return (
    <span className="text-xs px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 font-medium">
      Slow
    </span>
  );
};

const MonitorRow = ({ monitor, onDelete }) => {
  return (
    <tr className="hover:bg-cream transition-colors">
      <td className="px-5 py-3.5">
        <p className="text-sm font-medium text-[#7a3d20]">{monitor.name}</p>
      </td>
      <td className="px-5 py-3.5">
        <span className="text-xs px-2 py-0.5 rounded bg-cream text-[#7a3d20]">
          {monitor.type}
        </span>
      </td>
      <td className="px-5 py-3.5 text-sm text-[#b08070]">{monitor.interval}</td>
      <td className="px-5 py-3.5 text-sm text-[#7a3d20]">{monitor.latency}</td>
      <td className="px-5 py-3.5 text-sm text-[#7a3d20]">{monitor.uptime}</td>
      <td className="px-5 py-3.5">{statusBadge(monitor.status)}</td>
      <td className="px-5 py-3.5">
        <button
          onClick={() => onDelete(monitor.id)}
          className="text-xs text-red-400 hover:text-red-600 transition-colors"
        >
          Delete
        </button>
      </td>
    </tr>
  );
};

export default MonitorRow;
