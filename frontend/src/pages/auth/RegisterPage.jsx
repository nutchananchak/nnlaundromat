import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', phone: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.password) {
      setError('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }
    console.log('Register data:', form);
    navigate('/login');
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-6 bg-bg overflow-hidden">
      <div className="pointer-events-none absolute -top-24 -right-20 w-72 h-72 rounded-full bg-accent/20 blur-3xl animate-float-slow" />
      <div className="pointer-events-none absolute -bottom-28 -left-16 w-80 h-80 rounded-full bg-primary/20 blur-3xl animate-float-slower" />

      <div className="relative z-10 max-w-sm w-full bg-white rounded-3xl shadow-xl shadow-primary/10 border border-ink/5 p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <UserPlus className="text-primary" size={28} />
          </div>
          <h1 className="font-display font-semibold text-2xl text-ink text-center">สร้างบัญชีใหม่</h1>
          <p className="font-body text-sm text-ink-muted text-center mt-1">กรอกข้อมูลเพื่อเริ่มต้นใช้งาน</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Input label="ชื่อ-นามสกุล" name="name" value={form.name} onChange={handleChange} placeholder="กรอกชื่อ-นามสกุล" />
          <Input label="เบอร์โทรศัพท์" name="phone" value={form.phone} onChange={handleChange} placeholder="0XX-XXX-XXXX" />
          <Input label="รหัสผ่าน" type="password" name="password" value={form.password} onChange={handleChange} placeholder="ตั้งรหัสผ่าน" />

          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

          <Button type="submit">สมัครสมาชิก</Button>
        </form>

        <p className="text-center text-sm font-body text-ink-muted mt-5">
          มีบัญชีอยู่แล้ว?{' '}
          <Link to="/login" className="text-primary font-medium">เข้าสู่ระบบ</Link>
        </p>
      </div>
    </div>
  );
}