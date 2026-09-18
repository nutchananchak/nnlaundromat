import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../../components/auth/LoginForm';
import { useApp } from '../../context/AppContext';

const REGISTERED_RIDERS = [
  { id: 'RD-01', name: 'วรรณา สีดา', phone: '0891112222', password: 'rider1' },
  { id: 'RD-02', name: 'วันดี ทองอ่อน', phone: '0893334444', password: 'rider2' },
  { id: 'RD-03', name: 'สตาร์ วินเพียว', phone: '0895556666', password: 'rider3' }
];

const RiderSecurityModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div
      style={{
        position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center',
        justifyContent: 'center', zIndex: 9999, padding: '16px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#ffffff', width: '100%', maxWidth: '380px',
          borderRadius: '20px', padding: '24px 20px', textAlign: 'center',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ width: '52px', height: '52px', backgroundColor: '#f0fdfa', border: '1px solid #ccfbf1', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px auto', color: '#0f766e' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>
        <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#0f172a', margin: '0 0 6px 0' }}>ความปลอดภัยและรีเซ็ตรหัสผ่าน</h3>
        <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 20px 0', lineHeight: '1.5' }}>
          เพื่อความปลอดภัยของระบบจัดส่ง บัญชีพนักงานไม่รองรับการตั้งรหัสผ่านด้วยตนเอง กรุณาโทรติดต่อผู้จัดการเพื่อยืนยันตัวตน
        </p>
        <div style={{ marginBottom: '20px' }}>
          <a
            href="tel:0962450830"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '14px 16px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0',
              borderRadius: '12px', textDecoration: 'none', color: '#1e293b', fontSize: '13.5px', fontWeight: '600'
            }}
          >
            <span>ผู้จัดการ: 096-245-0830</span>
            <span style={{ color: '#0f766e', fontWeight: '700' }}>โทรออก</span>
          </a>
        </div>
        <button
          type="button"
          onClick={onClose}
          style={{ width: '100%', height: '42px', backgroundColor: '#0f172a', color: '#ffffff', border: 'none', borderRadius: '12px', fontSize: '13.5px', fontWeight: '600', cursor: 'pointer' }}
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

  // อ่านค่าจาก localStorage ทันทีเหมือน Admin
  const isRemembered = localStorage.getItem('rememberRider') === 'true';
  const savedId = isRemembered ? (localStorage.getItem('rememberedRiderId') || '') : '';
  const savedPass = isRemembered ? (localStorage.getItem('rememberedRiderPass') || '') : '';

  const [rememberMe, setRememberMe] = useState(isRemembered);
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
      localStorage.setItem('rememberedRiderId', trimmedInput);
      localStorage.setItem('rememberedRiderPass', trimmedPassword);
    } else {
      localStorage.removeItem('rememberRider');
      localStorage.removeItem('rememberedRiderId');
      localStorage.removeItem('rememberedRiderPass');
    }

    if (typeof loginRider === 'function') {
      loginRider(rider);
    }

    alert(`เข้าสู่ระบบสำเร็จ! ยินดีต้อนรับคุณ ${rider.name}`);
    navigate('/rider/tasks');
  };

  const riderFooterSlot = (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '16px', fontSize: '13px' }}>
      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', userSelect: 'none' }}>
        <input
          type="checkbox"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
          style={{ accentColor: '#1d61f2', width: '16px', height: '16px', cursor: 'pointer' }}
        />
        <span style={{ fontWeight: '500', color: '#475569' }}>จดจำบัญชีในเครื่องนี้</span>
      </label>
    </div>
  );

  return (
    <>
      <LoginForm
        key={`rider-form-${savedId}-${savedPass}`}
        subtitle="ระบบพนักงานรับ-ส่งผ้า"
        identifierLabel="เบอร์โทรศัพท์ / รหัสคนขับ"
        identifierPlaceholder="กรอกเบอร์โทรศัพท์หรือรหัสคนขับ"
        identifierType="text"
        initialIdentifier={savedId}
        initialPassword={savedPass}
        buttonText="เข้าสู่ระบบพนักงานรับส่ง"
        buttonVariant="primary"
        onForgotPasswordClick={(e) => { e.preventDefault(); setIsSecurityModalOpen(true); }}
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