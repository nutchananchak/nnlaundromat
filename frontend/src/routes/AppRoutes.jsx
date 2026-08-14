import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import CustomerLoginPage from '../pages/auth/CustomerLoginPage';
import RiderLoginPage from '../pages/auth/RiderLoginPage';
import AdminLoginPage from '../pages/auth/AdminLoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login/customer" replace />} />
      <Route path="/login" element={<Navigate to="/login/customer" replace />} />

      {/* หน้า Login แต่ละ Role */}
      <Route path="/login/customer" element={<CustomerLoginPage />} />
      <Route path="/login/rider" element={<RiderLoginPage />} />
      <Route path="/login/admin" element={<AdminLoginPage />} />

      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login/customer" replace />} />
    </Routes>
  );
};

export default AppRoutes;