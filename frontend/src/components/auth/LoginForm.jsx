import React, { useState } from 'react';
import Card from '../common/Card';
import Input from '../common/Input';
import Button from '../common/Button';

const LoginForm = ({
  subtitle = "บริการรับ-ส่งผ้าถึงหน้าบ้านคุณ",
  identifierLabel = "เบอร์โทรศัพท์",
  identifierPlaceholder = "กรอกเบอร์โทรศัพท์",
  identifierType = "text",
  buttonText = "เข้าสู่ระบบ",
  buttonVariant = "primary",
  forgotPasswordHref = null,
  onForgotPasswordClick = null,
  customFooter = null,
  footerText = null,
  footerLinkText = null,
  footerLinkHref = null,
  onSubmit,
}) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({ identifier, password });
    }
  };

  const hasForgotPassword = Boolean(onForgotPasswordClick || forgotPasswordHref);

  return (
    <Card subtitle={subtitle}>
      <form onSubmit={handleSubmit}>
        <Input
          label={identifierLabel}
          type={identifierType}
          placeholder={identifierPlaceholder}
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          required
        />

        <Input
          label="รหัสผ่าน"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />

        {/* แถบลิงก์ลืมรหัสผ่าน */}
        {hasForgotPassword && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-4px', marginBottom: '24px' }}>
            <a
              href={forgotPasswordHref || '#'}
              onClick={onForgotPasswordClick}
              style={{ fontSize: '13.5px', color: '#1d61f2', textDecoration: 'none', fontWeight: '500', cursor: 'pointer' }}
            >
              ลืมรหัสผ่าน?
            </a>
          </div>
        )}

        {!hasForgotPassword && <div style={{ marginBottom: '20px' }} />}

        {/* ปุ่ม Submit */}
        <Button type="submit" variant={buttonVariant}>
          {buttonText}
        </Button>

        {/* ส่วนขยายใต้ปุ่ม เช่น แถบจดจำบัญชี */}
        {customFooter}

        {/* ฟุตเตอร์ลิงก์สมัครสมาชิกของลูกค้า (ถ้ามี) */}
        {footerText && (
          <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '24px', marginBottom: '0' }}>
            {footerText}
            {footerLinkText && (
              <a
                href={footerLinkHref}
                style={{ color: '#1d61f2', textDecoration: 'none', fontWeight: '600', marginLeft: '4px' }}
              >
                {footerLinkText}
              </a>
            )}
          </p>
        )}
      </form>
    </Card>
  );
};

export default LoginForm;