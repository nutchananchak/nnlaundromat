import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const RegisterPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });

  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setErrorMsg('');

    // 1. ตรวจสอบรหัสผ่านตรงกันหรือไม่
    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน');
      return;
    }

    // 2. ตรวจสอบความยาวรหัสผ่าน
    if (formData.password.length < 6) {
      setErrorMsg('รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
      return;
    }

    // 3. ตรวจสอบการยอมรับเงื่อนไข
    if (!formData.acceptTerms) {
      setErrorMsg('กรุณายอมรับเงื่อนไขและข้อตกลงการให้บริการ');
      return;
    }

    console.log('ข้อมูลลงทะเบียนสำเร็จ:', formData);
    // TODO: เรียก API สมัครสมาชิก (Register API)
    
    alert('สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ');
    navigate('/login/customer');
  };

  return (
    <Card subtitle="สร้างบัญชีใหม่เพื่อเริ่มใช้บริการรับ-ส่งผ้า">
      <form onSubmit={handleRegister}>
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

        <Input
          label="ชื่อ - นามสกุล"
          name="fullName"
          type="text"
          placeholder="ซักผ้า สะอาดดี"
          value={formData.fullName}
          onChange={handleChange}
          required
          autoFocus
        />

        <Input
          label="เบอร์โทรศัพท์"
          name="phone"
          type="tel"
          placeholder="08XXXXXXXX"
          value={formData.phone}
          onChange={handleChange}
          required
        />

        <Input
          label="รหัสผ่าน"
          name="password"
          type="password"
          placeholder="ตั้งรหัสผ่านอย่างน้อย 6 ตัวอักษร"
          value={formData.password}
          onChange={handleChange}
          required
          autoComplete="new-password"
        />

        <Input
          label="ยืนยันรหัสผ่าน"
          name="confirmPassword"
          type="password"
          placeholder="กรอกรหัสผ่านอีกครั้ง"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          autoComplete="new-password"
        />

        {/* ยอมรับข้อกำหนดและเงื่อนไข */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '10px',
          textAlign: 'left',
          marginTop: '6px',
          marginBottom: '20px',
          paddingLeft: '2px'
        }}>
          <input
            type="checkbox"
            id="terms"
            name="acceptTerms"
            checked={formData.acceptTerms}
            onChange={handleChange}
            style={{
              width: '18px',
              height: '18px',
              marginTop: '2px',
              accentColor: '#1d61f2',
              cursor: 'pointer'
            }}
          />
          <label htmlFor="terms" style={{ fontSize: '13px', color: '#4b5563', lineHeight: '1.4', cursor: 'pointer' }}>
            ฉันยอมรับ{' '}
            <a href="#" style={{ color: '#1d61f2', textDecoration: 'none', fontWeight: '500' }}>
              เงื่อนไขการให้บริการ
            </a>{' '}
            และ{' '}
            <a href="#" style={{ color: '#1d61f2', textDecoration: 'none', fontWeight: '500' }}>
              นโยบายความเป็นส่วนตัว
            </a>
          </label>
        </div>

        <Button type="submit">สมัครสมาชิก</Button>

        <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '22px', marginBottom: 0 }}>
          มีบัญชีอยู่แล้วใช่หรือไม่?{' '}
          <a
            href="/login/customer"
            onClick={(e) => {
              e.preventDefault();
              navigate('/login/customer');
            }}
            style={{ color: '#1d61f2', textDecoration: 'none', fontWeight: '600', marginLeft: '4px' }}
          >
            เข้าสู่ระบบ
          </a>
        </p>
      </form>
    </Card>
  );
};

export default RegisterPage;