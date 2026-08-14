import React, { useState } from 'react';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1); // 1: กรอกเบอร์, 2: กรอก OTP, 3: รหัสผ่านใหม่
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // สเต็ป 1: ขอรหัส OTP
  const handleRequestOtp = (e) => {
    e.preventDefault();
    setErrorMsg('');

    // ตรวจสอบเบอร์โทร 10 หลัก
    const cleanPhone = phoneNumber.replace(/[-\s]/g, '');
    if (!/^0[0-9]{9}$/.test(cleanPhone)) {
      setErrorMsg('กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง (10 หลัก เช่น 08XXXXXXXX)');
      return;
    }

    console.log("ขอ OTP สำหรับเบอร์:", cleanPhone);
    // TODO: เรียก API ส่ง OTP
    setStep(2);
  };

  // สเต็ป 2: ยืนยันรหัส OTP (ตรวจสอบครบ 6 หลัก)
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanOtp = otp.trim();

    // ตรวจสอบว่ากรอกครบ 6 หลัก และเป็นตัวเลขทั้งหมด
    if (cleanOtp.length !== 6 || !/^[0-9]{6}$/.test(cleanOtp)) {
      setErrorMsg('กรุณากรอกรหัส OTP ให้ครบถ้วน 6 หลัก');
      return;
    }

    console.log("ยืนยัน OTP:", cleanOtp);
    // TODO: เรียก API ตรวจสอบ OTP กับเซิร์ฟเวอร์
    setStep(3);
  };

  // สเต็ป 3: ตั้งรหัสผ่านใหม่
  const handleResetPassword = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (newPassword.length < 6) {
      setErrorMsg('รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน');
      return;
    }

    console.log("ตั้งรหัสผ่านใหม่สำเร็จ");
    // TODO: เรียก API Reset Password
    alert("รีเซ็ตรหัสผ่านเรียบร้อยแล้ว! กรุณาเข้าสู่ระบบด้วยรหัสผ่านใหม่");
    window.location.href = "/login/customer";
  };

  return (
    <Card subtitle="รีเซ็ตรหัสผ่าน (สำหรับลูกค้า)">
      {/* กล่องแจ้งเตือน Error */}
      {errorMsg && (
        <div style={{
          backgroundColor: '#fef2f2',
          color: '#dc2626',
          padding: '10px 14px',
          borderRadius: '10px',
          fontSize: '13.5px',
          marginBottom: '16px',
          textAlign: 'left',
          border: '1px solid #fee2e2'
        }}>
          ⚠️ {errorMsg}
        </div>
      )}

      {/* STEP 1: กรอกเบอร์มือถือ */}
      {step === 1 && (
        <form onSubmit={handleRequestOtp}>
          <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '20px', textAlign: 'left', lineHeight: '1.5' }}>
            กรุณากรอกเบอร์โทรศัพท์ที่ลงทะเบียนไว้ ระบบจะส่งรหัส OTP ทาง SMS เพื่อยืนยันตัวตน
          </p>

          <Input
            label="เบอร์โทรศัพท์"
            type="tel"
            placeholder="08XXXXXXXX"
            value={phoneNumber}
            onChange={(e) => {
              setErrorMsg('');
              setPhoneNumber(e.target.value);
            }}
            maxLength={10}
            required
            autoFocus
          />

          <div style={{ marginTop: '24px' }}>
            <Button type="submit">ขอรหัส OTP</Button>
          </div>

          <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '24px', marginBottom: 0 }}>
            จำรหัสผ่านได้แล้ว?{' '}
            <a href="/login/customer" style={{ color: '#1d61f2', textDecoration: 'none', fontWeight: '600' }}>
              กลับไปเข้าสู่ระบบ
            </a>
          </p>
        </form>
      )}

      {/* STEP 2: กรอก OTP 6 หลัก (ซ่อนตัวเลขเป็น password mask) */}
      {step === 2 && (
        <form onSubmit={handleVerifyOtp}>
          <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '20px', textAlign: 'left', lineHeight: '1.5' }}>
            กรุณากรอกรหัส OTP 6 หลัก ที่ส่งไปยังเบอร์ <b>{phoneNumber}</b>
          </p>

          <Input
            label="รหัส OTP (6 หลัก)"
            type="password"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="••••••"
            value={otp}
            onChange={(e) => {
              setErrorMsg('');
              // กรองให้พิมพ์ได้เฉพาะตัวเลข และไม่เกิน 6 ตัว
              const onlyNums = e.target.value.replace(/[^0-9]/g, '');
              if (onlyNums.length <= 6) {
                setOtp(onlyNums);
              }
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
              ส่งอีกครั้ง
            </button>
          </p>
        </form>
      )}

      {/* STEP 3: ตั้งรหัสผ่านใหม่ */}
      {step === 3 && (
        <form onSubmit={handleResetPassword}>
          <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '20px', textAlign: 'left' }}>
            กรุณาตั้งรหัสผ่านใหม่สำหรับเข้าใช้งาน
          </p>

          <Input
            label="รหัสผ่านใหม่"
            type="password"
            placeholder="ตั้งรหัสผ่านอย่างน้อย 6 ตัวอักษร"
            value={newPassword}
            onChange={(e) => {
              setErrorMsg('');
              setNewPassword(e.target.value);
            }}
            minLength={6}
            required
            autoFocus
          />

          <Input
            label="ยืนยันรหัสผ่านใหม่"
            type="password"
            placeholder="กรอกรหัสผ่านใหม่อีกครั้ง"
            value={confirmPassword}
            onChange={(e) => {
              setErrorMsg('');
              setConfirmPassword(e.target.value);
            }}
            minLength={6}
            required
          />

          <div style={{ marginTop: '24px' }}>
            <Button type="submit">บันทึกรหัสผ่านใหม่</Button>
          </div>
        </form>
      )}
    </Card>
  );
};

export default ForgotPasswordPage;