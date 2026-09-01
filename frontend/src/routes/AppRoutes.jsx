import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import CustomerLoginPage from '../pages/auth/CustomerLoginPage';
import RiderLoginPage from '../pages/auth/RiderLoginPage';
import AdminLoginPage from '../pages/auth/AdminLoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import HomePage from '../pages/customer/HomePage'; 
import NewOrderPage from '../pages/customer/NewOrderPage';
import PaymentPage from '../pages/customer/PaymentPage';
import OrdersPage from '../pages/customer/OrdersPage';
import OrderDetailPage from '../pages/customer/OrderDetailPage';
import NotificationsPage from '../pages/customer/NotificationsPage';
import ProfilePage from '../pages/customer/ProfilePage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login/customer" replace />} />
      <Route path="/login" element={<Navigate to="/login/customer" replace />} />

      {/* หน้า Login และ Register */}
      <Route path="/login/customer" element={<CustomerLoginPage />} />
      <Route path="/login/rider" element={<RiderLoginPage />} />
      <Route path="/login/admin" element={<AdminLoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* หน้าหลักหลัง Login ของลูกค้า */}
      <Route path="/home" element={<HomePage />} />
      {/* เพิ่มหน้าสร้างออเดอร์ไว้ตรงนี้ */}
      <Route path="/order/new" element={<NewOrderPage />} />
      <Route path="/new-order" element={<NewOrderPage />} />
      <Route path="/order/payment" element={<PaymentPage />} />
      <Route path="/orders" element={<OrdersPage />} />
      <Route path="/orders/:id" element={<OrderDetailPage />} />
      <Route path="/notifications" element={<NotificationsPage />} />
      <Route path="/profile" element={<ProfilePage />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login/customer" replace />} />
    </Routes>
  );
};

export default AppRoutes;