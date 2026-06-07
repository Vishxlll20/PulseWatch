import { createBrowserRouter, Navigate } from 'react-router-dom';
import Login from '../features/auth/pages/Login';
import Register from '../features/auth/pages/Register';
import DashboardPage from '../features/dashboard/pages/DashboardPage';
import MonitorsPage from '../features/monitors/pages/MonitorsPage';
import CreateMonitorPage from '../features/monitors/pages/CreateMonitorPage';
import EditMonitorPage from '../features/monitors/pages/EditMonitorPage';
import LandingPage from '../features/landing/pages/LandingPage';
import IncidentPage from '../features/incident/pages/IncidentPage';
import AnalyticsPage from '../features/analytics/pages/AnalyticsPage';
import ForgotPassword from '../features/auth/pages/ForgotPassword';
import VerifyOtp from '../features/auth/pages/VerifyOtp';
import ResetPassword from '../features/auth/pages/ResetPassword';
import AlertsPage from '../features/alerts/pages/AlertsPage';
import SettingsPage from '../features/dashboard/pages/SettingsPage';
import Layout from "../features/admin/Layout";
import Monitors from "../features/admin/monitors/pages/Monitors";
import UsersPage from "../features/admin/users/pages/UsersPage";
import ProtectedRoute from '../components/ProtectedRoute';

const routes = createBrowserRouter([
    { path: '/', element: <LandingPage /> },
    { path: '/login', element: <Login /> },
    { path: '/register', element: <Register /> },
    { path: '/forgot-password', element: <ForgotPassword /> },
    { path: '/verify-otp', element: <VerifyOtp /> },
    { path: '/reset-password', element: <ResetPassword /> },
    { 
        path: '/dashboard', 
        element: <ProtectedRoute><DashboardPage /></ProtectedRoute> 
    },
    { 
        path: '/dashboard/monitors', 
        element: <ProtectedRoute><MonitorsPage /></ProtectedRoute> 
    },
    { 
        path: '/dashboard/monitors/new', 
        element: <ProtectedRoute><CreateMonitorPage /></ProtectedRoute> 
    },
    { 
        path: '/dashboard/monitors/:id/edit', 
        element: <ProtectedRoute><EditMonitorPage /></ProtectedRoute> 
    },
    { 
        path: '/dashboard/incidents', 
        element: <ProtectedRoute><IncidentPage /></ProtectedRoute> 
    },
    { 
        path: '/dashboard/analytics', 
        element: <ProtectedRoute><AnalyticsPage /></ProtectedRoute> 
    },
    { 
        path: '/dashboard/alerts', 
        element: <ProtectedRoute><AlertsPage /></ProtectedRoute> 
    },
    { 
        path: '/dashboard/settings', 
        element: <ProtectedRoute><SettingsPage /></ProtectedRoute> 
    },
    {
        path: "/admin",
        element: <ProtectedRoute><Layout /></ProtectedRoute>,
        children: [
            { index: true, element: <Navigate to="/admin/monitors" replace /> },
            { path: "monitors", element: <Monitors /> },
            { path: "users", element: <UsersPage /> },
        ],
    },
]);

export default routes;
