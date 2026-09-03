import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../../components/auth/LoginForm';
import { useApp } from '../../context/AppContext';

const CustomerLoginPage = () => {
  const navigate = useNavigate();
  const { loginUser } = useApp();
  const [errorMessage, setErrorMessage] = useState('');

  const handleCustomerLogin = ({ identifier, password }) => {
    setErrorMessage('');
    
    // ดึงผู้ใช้ทั้งหมดที่เคยสมัครไว้
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const user = existingUsers.find(u => u.phone === identifier);

    if (!user) {
      alert('ไม่พบบัญชีผู้ใช้นี้ กรุณาสมัครสมาชิกก่อนเข้าสู่ระบบ');
      return;
    }

    if (user.password !== password) {
      alert('รหัสผ่านไม่ถูกต้อง');
      return;
    }

    // ล็อกอินสำเร็จ: ส่งข้อมูลเข้า Context และ localStorage
    loginUser(user);

    console.log(
      `%c [N&N LAUNDROMAT] LOGIN SUCCESS %c\n` +
      `+--------------------------------------------------------+\n` +
      `| ผู้ใช้งาน        : ${user.fullName.padEnd(36)}|\n` +
      `| เบอร์โทรศัพท์   : ${user.phone.padEnd(36)}|\n` +
      `+--------------------------------------------------------+`,
      'background: #0f4c81; color: #ffffff; font-weight: bold; padding: 4px 10px; border-radius: 4px; font-size: 11px;',
      'color: #0c4a7e; font-family: monospace; font-size: 12px; line-height: 1.5;'
    );

    navigate('/home');
  };

  return (
    <div>
      {errorMessage && (
        <div style={{ color: '#dc2626', marginBottom: '12px', fontSize: '13.5px', textAlign: 'center' }}>
          {errorMessage}
        </div>
      )}
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
    </div>
  );
};

export default CustomerLoginPage;