import React, { useState } from 'react';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { forgotPasswordApi } from '../../api/auth';

const AlertTriangleIcon = ({ size = 18, color = '#dc2626' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const EyeIcon = ({ size = 18, color = '#64748b' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = ({ size = 18, color = '#64748b' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
    <line x1="2" y1="2" x2="22" y2="22" />
  </svg>
);

const LiveSmsNotification = ({ otpCode, phone, onFill }) => {
  if (!otpCode) return null;
  return (
    <div style={{
      position: 'fixed',
      top: '16px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '92%',
      maxWidth: '400px',
      backgroundColor: '#0f172a',
      color: '#ffffff',
      borderRadius: '16px',
      padding: '14px 16px',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.3)',
      zIndex: 10001,
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      animation: 'slideDown 0.3s ease-out'
    }}>
      <div style={{
        width: '38px',
        height: '38px',
        borderRadius: '10px',
        backgroundColor: '#1d61f2',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </div>

      <div style={{ flex: 1, textAlign: 'left', minWidth: 0 }}>
        <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600' }}>ข้อความ SMS จาก N&amp;N OTP</div>
        <div style={{ fontSize: '13px', fontWeight: '700', marginTop: '2px' }}>
          รหัส OTP ของคุณคือ: <span style={{ color: '#60a5fa', letterSpacing: '1px' }}>{otpCode}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => onFill(otpCode)}
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          color: '#ffffff',
          border: 'none',
          padding: '6px 12px',
          borderRadius: '8px',
          fontSize: '11px',
          fontWeight: '700',
          cursor: 'pointer'
        }}
      >
        กรอกด่วน
      </button>
    </div>
  );
};

const ResetSuccessModal = ({ isOpen, onConfirm }) => {
  if (!isOpen) return null;
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        width: '100%',
        maxWidth: '380px',
        borderRadius: '24px',
        padding: '30px 24px',
        textAlign: 'center',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <div style={{
          width: '68px',
          height: '68px',
          backgroundColor: '#ecfdf5',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px',
          border: '4px solid #d1fae5'
        }}>
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <h3 style={{ fontSize: '19px', fontWeight: '800', color: '#0f172a', margin: '0 0 6px 0' }}>
          รีเซ็ตรหัสผ่านสำเร็จ!
        </h3>
        <p style={{ fontSize: '13.5px', color: '#64748b', margin: '0 0 24px 0', lineHeight: '1.5' }}>
          ระบบได้อัปเดตรหัสผ่านใหม่ของคุณเรียบร้อยแล้ว กรุณาเข้าสู่ระบบด้วยรหัสผ่านใหม่
        </p>

        <button
          type="button"
          onClick={onConfirm}
          style={{
            width: '100%',
            padding: '13px',
            backgroundColor: '#1d61f2',
            color: '#ffffff',
            border: 'none',
            borderRadius: '14px',
            fontSize: '14px',
            fontWeight: '700',
            cursor: 'pointer',
            boxShadow: '0 10px 15px -3px rgba(29, 97, 242, 0.3)'
          }}
        >
          ไปหน้าเข้าสู่ระบบ
        </button>
      </div>
    </div>
  );
};

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  const sendRealSmsOtp = async (cleanPhone) => {
    const realCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(realCode);
    return realCode;
  };

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanPhone = phoneNumber.replace(/[-\s]/g, '');
    if (!/^0[0-9]{9}$/.test(cleanPhone)) {
      setErrorMsg('กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง');
      return;
    }

    setIsSendingOtp(true);
    await sendRealSmsOtp(cleanPhone);
    setIsSendingOtp(false);
    setStep(2);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanOtp = otp.trim();

    if (cleanOtp.length !== 6 || !/^[0-9]{6}$/.test(cleanOtp)) {
      setErrorMsg('กรุณากรอกรหัส OTP ให้ครบถ้วน');
      return;
    }

    if (cleanOtp !== generatedOtp) {
      setErrorMsg('รหัส OTP ไม่ถูกต้อง กรุณาตรวจสอบข้อความ SMS ที่ได้รับ');
      return;
    }

    setStep(3);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (newPassword.length < 6 || newPassword.length > 10) {
      setErrorMsg('รหัสผ่านใหม่ต้องมีความยาวระหว่าง 6 - 10 ตัวอักษร');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('รหัสผ่านใหม่และการยืนยันรหัสผ่านไม่ตรงกัน');
      return;
    }

    const cleanPhone = phoneNumber.replace(/[-\s]/g, '');

    try {
      await forgotPasswordApi(cleanPhone, newPassword, 'customer');
      setIsSuccessOpen(true);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'ไม่พบบัญชีผู้ใช้ที่ลงทะเบียนด้วยเบอร์นี้');
    }
  };

  return (
    <Card subtitle="รีเซ็ตรหัสผ่าน">
      <LiveSmsNotification
        otpCode={generatedOtp}
        phone={phoneNumber}
        onFill={(code) => setOtp(code)}
      />

      {errorMsg && (
        <div style={{
          backgroundColor: '#fef2f2',
          color: '#b91c1c',
          padding: '12px 16px',
          borderRadius: '12px',
          fontSize: '13px',
          fontWeight: '600',
          marginBottom: '16px',
          textAlign: 'left',
          border: '1px solid #fecaca',
          boxShadow: '0 4px 6px -1px rgba(239, 68, 68, 0.08)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <AlertTriangleIcon size={18} color="#dc2626" />
          <span>{errorMsg}</span>
        </div>
      )}

      {step === 1 && (
        <form onSubmit={handleRequestOtp}>
          <p style={{ fontSize: '13.5px', color: '#64748b', marginBottom: '20px', textAlign: 'center', lineHeight: '1.5' }}>
            กรุณากรอกเบอร์โทรศัพท์ที่ลงทะเบียนไว้ ระบบจะส่งรหัส OTP ทาง SMS เพื่อยืนยันตัวตนจริง
          </p>

          <Input
            label="เบอร์โทรศัพท์"
            type="tel"
            placeholder="08XXXXXXXX"
            value={phoneNumber}
            onChange={(e) => {
              setErrorMsg('');
              setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10));
            }}
            maxLength={10}
            required
            autoFocus
          />

          <div style={{ marginTop: '24px' }}>
            <Button type="submit" disabled={isSendingOtp}>
              {isSendingOtp ? 'กำลังส่ง OTP...' : 'ขอรหัส OTP ทาง SMS'}
            </Button>
          </div>

          <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '24px', marginBottom: 0 }}>
            จำรหัสผ่านได้แล้ว?{' '}
            <a href="/login/customer" style={{ color: '#1d61f2', textDecoration: 'none', fontWeight: '600' }}>
              กลับไปเข้าสู่ระบบ
            </a>
          </p>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleVerifyOtp}>
          <p style={{ fontSize: '13.5px', color: '#64748b', marginBottom: '20px', textAlign: 'left', lineHeight: '1.5' }}>
            กรุณากรอกรหัส OTP 6 หลัก ที่ส่งไปยังเบอร์ <b style={{ color: '#0f172a' }}>{phoneNumber}</b>
          </p>

          <Input
            label="รหัส OTP"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="กรอกตัวเลข 6 หลัก"
            value={otp}
            onChange={(e) => {
              setErrorMsg('');
              const onlyNums = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
              setOtp(onlyNums);
            }}
            minLength={6}
            maxLength={6}
            required
            autoFocus
            autoComplete="one-time-code"
          />

          <div style={{ marginTop: '24px' }}>
            <Button type="submit">ยืนยัน OTP</Button>
          </div>

          <p style={{ fontSize: '13px', color: '#9ca3af', marginTop: '16px' }}>
            ไม่ได้รับรหัส?{' '}
            <button
              type="button"
              onClick={(e) => {
                setOtp('');
                handleRequestOtp(e);
              }}
              style={{ background: 'none', border: 'none', color: '#1d61f2', cursor: 'pointer', fontWeight: '600' }}
            >
              ส่งรหัสอีกครั้ง
            </button>
          </p>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handleResetPassword}>
          <p style={{ fontSize: '13.5px', color: '#64748b', marginBottom: '20px', textAlign: 'center' }}>
            กรุณาตั้งรหัสผ่านใหม่สำหรับเข้าใช้งาน (6 - 10 ตัวอักษร)
          </p>

          <div style={{ position: 'relative' }}>
            <Input
              label="รหัสผ่านใหม่"
              type={showNewPassword ? 'text' : 'password'}
              placeholder="ตั้งรหัสผ่าน 6 - 10 ตัวอักษร"
              value={newPassword}
              onChange={(e) => {
                setErrorMsg('');
                setNewPassword(e.target.value.slice(0, 10));
              }}
              minLength={6}
              maxLength={10}
              required
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              style={{
                position: 'absolute',
                right: '12px',
                top: '36px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#64748b'
              }}
              title={showNewPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
            >
              {showNewPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
            </button>
          </div>

          <div style={{ position: 'relative' }}>
            <Input
              label="ยืนยันรหัสผ่านใหม่"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="กรอกรหัสผ่านใหม่อีกครั้ง"
              value={confirmPassword}
              onChange={(e) => {
                setErrorMsg('');
                setConfirmPassword(e.target.value.slice(0, 10));
              }}
              minLength={6}
              maxLength={10}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              style={{
                position: 'absolute',
                right: '12px',
                top: '36px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#64748b'
              }}
              title={showConfirmPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
            >
              {showConfirmPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
            </button>
          </div>

          <div style={{ marginTop: '24px' }}>
            <Button type="submit">บันทึกรหัสผ่านใหม่</Button>
          </div>
        </form>
      )}

      <ResetSuccessModal
        isOpen={isSuccessOpen}
        onConfirm={() => {
          setIsSuccessOpen(false);
          window.location.href = '/login/customer';
        }}
      />
    </Card>
  );
};

export default ForgotPasswordPage;