import React from 'react';
import LoginForm from '../../components/auth/LoginForm';

const AdminLoginPage = () => {
  const handleAdminLogin = ({ identifier, password }) => {
    console.log("Admin Login:", { identifier, password });
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    alert(
      "【ความปลอดภัยระดับสูง - สำหรับเจ้าหน้าที่】\n\nระบบไม่รองรับการรีเซ็ตรหัสผ่านด้วยตนเอง\nกรุณายืนยันตัวตนโดยตรงกับ Super Admin เพื่อขอออกสิทธิ์เข้าถึงใหม่\n\n📧 อีเมล: superadmin@laundromat.com\n🔐 ติดต่อฝ่ายดูแลระบบความปลอดภัย"
    );
  };

  return (
    <LoginForm
      subtitle="ระบบบริหารจัดการสำหรับเจ้าหน้าที่ (Admin)"
      identifierLabel="ชื่อผู้ใช้งานแอดมิน"
      identifierPlaceholder="admin@laundromat.com"
      buttonText="เข้าสู่ระบบ"
      buttonVariant="admin"
      onForgotPasswordClick={handleForgotPassword}
      onSubmit={handleAdminLogin}
    />
  );
};

export default AdminLoginPage;