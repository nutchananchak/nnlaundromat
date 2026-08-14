import React from 'react';
import LoginForm from '../../components/auth/LoginForm';

const RiderLoginPage = () => {
  const handleRiderLogin = ({ identifier, password }) => {
    console.log("Rider Login:", { identifier, password });
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    alert(
      "【สำหรับพนักงานขับรถ】\n\nหากลืมรหัสผ่าน กรุณาติดต่อฝ่ายจัดการ (Admin) เพื่อทำการรีเซ็ตรหัสผ่านใหม่\n\n📞 โทร: 02-XXX-XXXX\n💬 LINE ID: @nn_rider_support"
    );
  };

  return (
    <LoginForm
      subtitle="ระบบพนักงานรับ-ส่งผ้า"
      identifierLabel="เบอร์โทรศัพท์ / รหัสคนขับ"
      identifierPlaceholder="กรอกเบอร์โทรศัพท์หรือรหัสคนขับ"
      identifierType="tel"
      buttonText="เข้าสู่ระบบ"
      onForgotPasswordClick={handleForgotPassword}
      onSubmit={handleRiderLogin}
    />
  );
};

export default RiderLoginPage;