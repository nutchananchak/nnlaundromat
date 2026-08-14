import React from 'react';
import LoginForm from '../../components/auth/LoginForm';

const CustomerLoginPage = () => {
  const handleCustomerLogin = ({ identifier, password }) => {
    console.log("Customer Login:", { identifier, password });
    // TODO: เรียก API Login ฝั่งลูกค้า
  };

  return (
    <LoginForm
      subtitle="บริการรับ-ส่งผ้าถึงหน้าบ้านคุณ"
      identifierLabel="เบอร์โทรศัพท์"
      identifierPlaceholder="กรอกเบอร์โทรศัพท์"
      buttonText="เข้าสู่ระบบ"
      forgotPasswordHref="/forgot-password"
      footerText="ยังไม่มีบัญชีใช่หรือไม่?"
      footerLinkText="สมัครสมาชิก"
      footerLinkHref="/register"
      onSubmit={handleCustomerLogin}
    />
  );
};

export default CustomerLoginPage;