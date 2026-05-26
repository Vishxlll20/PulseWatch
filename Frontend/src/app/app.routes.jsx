import { Routes, Route } from "react-router-dom";

import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";

import DashboardPage from "../features/dashboard/pages/DashboardPage";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route path="/dashboard" element={<DashboardPage />} />
    </Routes>
  );
}

export default AppRoutes;
