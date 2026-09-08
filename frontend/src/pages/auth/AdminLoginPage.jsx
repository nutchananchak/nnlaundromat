import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../../components/auth/LoginForm';

const REGISTERED_ADMINS = [
  {
    id: 'ADM-01',
    name: 'ฝ่ายปฏิบัติการกลาง',
    username: 'admin@nnlaundromat.com',
    password: 'admin123'
  },
  {
    id: 'ADM-02',
    name: 'ผู้จัดการ',
    username: 'manager',
    password: 'admin123'
  }
];

// โมดอลแจ้งเตือนมาตรการความปลอดภัยระดับผู้ดูแลระบบ
const AdminSecurityModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.7)',
        backdropFilter: 'blur(3px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '16px',
        boxSizing: 'border-box'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          width: '100%',
          maxWidth: '390px',
          borderRadius: '20px',
          padding: '24px 20px',
          boxSizing: 'border-box',
          textAlign: 'center',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            width: '52px',
            height: '52px',
            backgroundColor: '#eff6ff',
            border: '1px solid #bfdbfe',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 14px auto',
            color: '#1d61f2'
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>

        <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#0f172a', margin: '0 0 6px 0' }}>
          ความปลอดภัยระดับผู้ดูแลระบบ
        </h3>
        <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 18px 0', lineHeight: '1.5' }}>
          ระบบไม่รองรับการรีเซ็ตรหัสผ่านด้วยตนเอง กรุณายืนยันตัวตนกับผู้ดูแลระบบส่วนกลาง (Super Admin) เพื่อขอออกสิทธิ์เข้าถึงใหม่
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px', textAlign: 'left' }}>
          <div
            style={{
              padding: '12px 14px',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}
          >
            <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>ฝ่ายดูแลระบบความปลอดภัย</span>
            <span style={{ fontSize: '13px', color: '#0f172a', fontWeight: '700' }}>nnutchanan.ncn@gmail.com</span>
          </div>

          <div
            style={{
              padding: '12px 14px',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}
          >
            <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>โทรศัพท์ฉุกเฉินเฉพาะกิจ</span>
            <span style={{ fontSize: '13px', color: '#0f172a', fontWeight: '700' }}>089-8917104</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          style={{
            width: '100%',
            height: '42px',
            backgroundColor: '#1d61f2',
            color: '#ffffff',
            border: 'none',
            borderRadius: '12px',
            fontSize: '13.5px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          เข้าใจแล้ว
        </button>
      </div>
    </div>
  );
};

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const [rememberMe, setRememberMe] = useState(true);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);

  const handleAdminLogin = ({ identifier, password }) => {
    const trimmedInput = (identifier || '').trim();
    const trimmedPassword = (password || '').trim();

    const admin = REGISTERED_ADMINS.find(
      (a) =>
        (a.username.toLowerCase() === trimmedInput.toLowerCase() ||
          a.id.toLowerCase() === trimmedInput.toLowerCase()) &&
        a.password === trimmedPassword
    );

    if (!admin) {
      alert('ชื่อผู้ใช้งานหรือรหัสผ่านแอดมินไม่ถูกต้อง');
      return;
    }

    localStorage.setItem('currentAdmin', JSON.stringify(admin));
    if (rememberMe) {
      localStorage.setItem('rememberAdmin', 'true');
    }

    console.log(
      `%c [N&N LAUNDROMAT] ADMIN LOGIN SUCCESS %c\n` +
      `+--------------------------------------------------------+\n` +
      `| รหัสเจ้าหน้าที่ : ${admin.id.padEnd(36)}|\n` +
      `| แผนกงาน       : ${admin.name.padEnd(36)}|\n` +
      `| บัญชีเข้าใช้   : ${admin.username.padEnd(36)}|\n` +
      `+--------------------------------------------------------+`,
      'background: #1d61f2; color: #ffffff; font-weight: bold; padding: 4px 10px; border-radius: 4px; font-size: 11px;',
      'color: #1e3a8a; font-family: monospace; font-size: 12px; line-height: 1.5;'
    );

    navigate('/admin/dashboard');
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setIsSecurityModalOpen(true);
  };

  // แถบจดจำบัญชีแบบจัดกึ่งกลาง
  const adminFooterSlot = (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '16px',
        fontSize: '13px',
        color: '#64748b'
      }}
    >
      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', userSelect: 'none' }}>
        <input
          type="checkbox"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
          style={{ accentColor: '#1d61f2', width: '15px', height: '15px', cursor: 'pointer' }}
        />
        <span style={{ fontWeight: '500', color: '#475569' }}>จดจำเซสชันผู้ดูแลระบบในเครื่องนี้</span>
      </label>
    </div>
  );

  return (
    <>
      <LoginForm
        subtitle="ระบบบริหารจัดการสำหรับเจ้าหน้าที่ (Admin)"
        identifierLabel="ชื่อผู้ใช้งานแอดมิน"
        identifierPlaceholder="admin@nnlaundromat.com"
        identifierType="text"
        buttonText="เข้าสู่ระบบผู้ดูแล"
        buttonVariant="primary"
        onForgotPasswordClick={handleForgotPassword}
        customFooter={adminFooterSlot}
        onSubmit={handleAdminLogin}
      />

      <AdminSecurityModal
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
      />
    </>
  );
};

export default AdminLoginPage;