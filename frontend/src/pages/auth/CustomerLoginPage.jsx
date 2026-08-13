import { useNavigate, Link } from 'react-router-dom';
import { Shirt } from 'lucide-react';
import LoginForm from '../../components/auth/LoginForm';

export default function CustomerLoginPage() {
  const navigate = useNavigate();

  const handleLogin = (data, setError) => {
    console.log('Customer login:', data);
    navigate('/home');
  };

  return (
    <LoginForm
      role="customer"
      icon={Shirt}
      title="N&N Laundromat"
      subtitle="บริการรับ-ส่งผ้าถึงหน้าบ้านคุณ"
      onSubmit={handleLogin}
      footer={
        <p className="text-center text-sm font-body text-ink-muted">
          ยังไม่มีบัญชีใช่ไหม?{' '}
          <Link to="/register" className="text-primary font-medium">
            สมัครสมาชิก
          </Link>
        </p>
      }
    />
  );
}