import { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';

export default function LoginForm({ role, icon: Icon, title, subtitle, onSubmit, footer }) {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ role, phone, password }, setError);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-6 bg-bg overflow-hidden">
      {/* ฟองสบู่ตกแต่งพื้นหลัง */}
      <div className="pointer-events-none absolute -top-24 -left-20 w-72 h-72 rounded-full bg-primary/20 blur-3xl animate-float-slow" />
      <div className="pointer-events-none absolute -bottom-28 -right-16 w-80 h-80 rounded-full bg-accent/25 blur-3xl animate-float-slower" />
      <div className="pointer-events-none absolute top-1/3 right-8 w-16 h-16 rounded-full bg-white/60 blur-xl animate-float-slow" />

      <div className="relative z-10 max-w-sm w-full bg-white rounded-3xl shadow-xl shadow-primary/10 border border-ink/5 p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <Icon className="text-primary" size={28} strokeWidth={2} />
          </div>
          <h1 className="font-display font-semibold text-2xl text-ink text-center">{title}</h1>
          <p className="font-body text-sm text-ink-muted text-center mt-1">{subtitle}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Input
            label="เบอร์โทรศัพท์"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="0XX-XXX-XXXX"
          />
          <Input
            label="รหัสผ่าน"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="กรอกรหัสผ่าน"
          />

          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

          <Button type="submit">เข้าสู่ระบบ</Button>
        </form>

        {footer && <div className="mt-5">{footer}</div>}
      </div>
    </div>
  );
}