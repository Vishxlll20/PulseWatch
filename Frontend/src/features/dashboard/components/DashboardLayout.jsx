function DashboardLayout({
  children,
}) {
  return (
    <div className="bg-[#020817] text-white min-h-screen flex">
      {children}
    </div>
  );
}

export default DashboardLayout;