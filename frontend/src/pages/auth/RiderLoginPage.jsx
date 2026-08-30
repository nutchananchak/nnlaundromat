import React, { useState } from 'react';
import LoginForm from '../../components/auth/LoginForm';

// --- ป๊อปอัปแจ้งติดต่อแอดมินสำหรับ Rider ---
const RiderSupportModal = ({ isOpen, onClose }) => {
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
        {/* ไอคอนศูนย์บริการคนขับ */}
        <div
          style={{
            width: '56px',
            height: '56px',
            backgroundColor: '#eff6ff',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '26px',
            margin: '0 auto 14px auto',
            color: '#1d61f2'
          }}
        >
          🛵
        </div>

        <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: '0 0 6px 0' }}>
          ช่วยเหลือด้านรหัสผ่าน
        </h3>
        <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 20px 0', lineHeight: '1.5' }}>
          ระบบไม่รองรับการรีเซ็ตรหัสผ่านด้วยตนเอง กรุณาติดต่อฝ่ายจัดการ (Admin) เพื่อยืนยันตัวตนคนขับ
        </p>

        {/* กล่องรายการช่องทางติดต่อ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
          {/* แถบโทรศัพท์ */}
          <a
            href="tel:021234567"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              textDecoration: 'none',
              color: '#1e293b',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '18px' }}>📞</span>
              <span>ฝ่ายจัดส่ง (Call Center)</span>
            </div>
            <span style={{ color: '#1d61f2', fontSize: '13px' }}>โทรออก</span>
          </a>

          {/* แถบ LINE Support */}
          <a
            href="https://line.me/R/ti/p/@nn_rider_support"
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              backgroundColor: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: '12px',
              textDecoration: 'none',
              color: '#166534',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '18px' }}>💬</span>
              <span>LINE: @nn_rider_support</span>
            </div>
            <span style={{ color: '#15803d', fontSize: '13px' }}>แชทเลย</span>
          </a>
        </div>

        {/* ปุ่มปิด */}
        <button
          type="button"
          onClick={onClose}
          style={{
            width: '100%',
            height: '44px',
            backgroundColor: '#0f172a',
            color: '#ffffff',
            border: 'none',
            borderRadius: '12px',
            fontSize: '14px',
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

// --- หน้า Login ของ Rider ---
const RiderLoginPage = () => {
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  const handleRiderLogin = ({ identifier, password }) => {
    console.log("Rider Login:", { identifier, password });
    // TODO: เรียก API เข้าสู่ระบบของ Rider
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setIsSupportOpen(true);
  };

  return (
    <>
      <LoginForm
        subtitle="ระบบพนักงานรับ-ส่งผ้า"
        identifierLabel="เบอร์โทรศัพท์ / รหัสคนขับ"
        identifierPlaceholder="กรอกเบอร์โทรศัพท์หรือรหัสคนขับ"
        identifierType="tel"
        buttonText="เข้าสู่ระบบพนักงานรับส่ง"
        onForgotPasswordClick={handleForgotPassword}
        onSubmit={handleRiderLogin}
      />

      <RiderSupportModal
        isOpen={isSupportOpen}
        onClose={() => setIsSupportOpen(false)}
      />
    </>
  );
};

export default RiderLoginPage;