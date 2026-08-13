import { Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import HomePage from '../pages/customer/HomePage';
import TaskPage from '../pages/rider/TaskPage';
import DashboardPage from '../pages/admin/DashboardPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/rider/tasks" element={<TaskPage />} />
      <Route path="/admin/dashboard" element={<DashboardPage />} />
    </Routes>
  );
}