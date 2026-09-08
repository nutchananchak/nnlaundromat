import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../../components/auth/LoginForm';
import { useApp } from '../../context/AppContext';

const REGISTERED_RIDERS = [
  {
    id: 'RD-01',
    name: 'วรรณา สีดา',
    phone: '0891112222',
    password: 'rider1'
  },
  {
    id: 'RD-02',
    name: 'วันดี ทองอ่อน',
    phone: '0893334444',
    password: 'rider2'
  },
  {
    id: 'RD-03',
    name: 'ซิน วินเพียว',
    phone: '0895556666',
    password: 'rider3'
  }
];

// ป๊อปอัปแจ้งยืนยันความปลอดภัยและเบอร์ติดต่อตรง
const RiderSecurityModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
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
          maxWidth: '380px',
          borderRadius: '20px',
          padding: '24px 20px',
          boxSizing: 'border-box',
          textAlign: 'center',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            width: '52px',
            height: '52px',
            backgroundColor: '#f0fdfa',
            border: '1px solid #ccfbf1',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 14px auto',
            color: '#0f766e'
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>

        <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#0f172a', margin: '0 0 6px 0' }}>
          ความปลอดภัยและรีเซ็ตรหัสผ่าน
        </h3>
        <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 20px 0', lineHeight: '1.5' }}>
          เพื่อความปลอดภัยของระบบจัดส่ง บัญชีพนักงานไม่รองรับการตั้งรหัสผ่านด้วยตนเอง กรุณาโทรติดต่อผู้จัดการเพื่อยืนยันตัวตน
        </p>

        {/* แถบโทรออกหาเบอร์ 0962450830 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
          <a
            href="tel:0962450830"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 16px',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              textDecoration: 'none',
              color: '#1e293b',
              fontSize: '13.5px',
              fontWeight: '600'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0f766e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span>ผู้จัดการ: 096-245-0830</span>
            </div>
            <span style={{ color: '#0f766e', fontSize: '13px', fontWeight: '700' }}>โทรออก</span>
          </a>
        </div>

        <button
          type="button"
          onClick={onClose}
          style={{
            width: '100%',
            height: '42px',
            backgroundColor: '#0f172a',
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

const RiderLoginPage = () => {
  const navigate = useNavigate();
  const { loginRider } = useApp ? useApp() : {};
  const [rememberMe, setRememberMe] = useState(true);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);

  const handleRiderLogin = ({ identifier, password }) => {
    const trimmedInput = (identifier || '').trim();
    const trimmedPassword = (password || '').trim();

    const rider = REGISTERED_RIDERS.find(
      (r) =>
        (r.phone === trimmedInput || r.id.toLowerCase() === trimmedInput.toLowerCase()) &&
        r.password === trimmedPassword
    );

    if (!rider) {
      alert('เบอร์โทรศัพท์/รหัสคนขับ หรือรหัสผ่านไม่ถูกต้อง');
      return;
    }

    localStorage.setItem('currentRider', JSON.stringify(rider));
    if (rememberMe) {
      localStorage.setItem('rememberRider', 'true');
    }

    if (typeof loginRider === 'function') {
      loginRider(rider);
    }

    console.log(
      `%c [N&N LAUNDROMAT] RIDER LOGIN SUCCESS %c\n` +
      `+--------------------------------------------------------+\n` +
      `| รหัสคนขับ      : ${rider.id.padEnd(36)}|\n` +
      `| ชื่อพนักงาน    : ${rider.name.padEnd(36)}|\n` +
      `| เบอร์โทรศัพท์   : ${rider.phone.padEnd(36)}|\n` +
      `+--------------------------------------------------------+`,
      'background: #0f766e; color: #ffffff; font-weight: bold; padding: 4px 10px; border-radius: 4px; font-size: 11px;',
      'color: #042f2e; font-family: monospace; font-size: 12px; line-height: 1.5;'
    );

    alert(`ยินดีต้อนรับคุณ ${rider.name}`);
    navigate('/rider/dashboard');
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setIsSecurityModalOpen(true);
  };

  // แถบจดจำบัญชีแบบจัดกึ่งกลาง (ไม่ใส่ป้ายพนักงานภายใน)
  const riderFooterSlot = (
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
          style={{ accentColor: '#0f4c81', width: '15px', height: '15px', cursor: 'pointer' }}
        />
        <span style={{ fontWeight: '500', color: '#475569' }}>จดจำบัญชีในเครื่องนี้</span>
      </label>
    </div>
  );

  return (
    <>
      <LoginForm
        subtitle="ระบบพนักงานรับ-ส่งผ้า"
        identifierLabel="เบอร์โทรศัพท์ / รหัสคนขับ"
        identifierPlaceholder="กรอกเบอร์โทรหรือรหัสคนขับ"
        identifierType="text"
        buttonText="เข้าสู่ระบบพนักงานรับส่ง"
        buttonVariant="primary"
        onForgotPasswordClick={handleForgotPassword}
        customFooter={riderFooterSlot}
        onSubmit={handleRiderLogin}
      />

      <RiderSecurityModal
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
      />
    </>
  );
};

export default RiderLoginPage;