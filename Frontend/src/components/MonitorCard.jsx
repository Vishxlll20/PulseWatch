function MonitorCard({ monitor }) {
  return (
    <div
      style={{
        border: "1px solid gray",
        padding: "20px",
        marginBottom: "10px",
        borderRadius: "10px",
      }}
    >
      <h2>{monitor.name}</h2>

      <p>{monitor.url}</p>

      <h3>
        Status:
        {" "}
        {monitor.status}
      </h3>

      <p>
        Response Time:
        {" "}
        {monitor.responseTime}ms
      </p>
    </div>
  );
}

export default MonitorCard;