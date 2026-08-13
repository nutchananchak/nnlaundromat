import { Routes, Route } from 'react-router-dom';
import CustomerLoginPage from '../pages/auth/CustomerLoginPage';
import RiderLoginPage from '../pages/auth/RiderLoginPage';
import AdminLoginPage from '../pages/auth/AdminLoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import HomePage from '../pages/customer/HomePage';
import TaskPage from '../pages/rider/TaskPage';
import DashboardPage from '../pages/admin/DashboardPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<CustomerLoginPage />} />
      <Route path="/rider/login" element={<RiderLoginPage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/rider/tasks" element={<TaskPage />} />
      <Route path="/admin/dashboard" element={<DashboardPage />} />
    </Routes>
  );
}