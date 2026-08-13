import { useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import LoginForm from '../../components/auth/LoginForm';

export default function AdminLoginPage() {
  const navigate = useNavigate();

  const handleLogin = (data, setError) => {
    console.log('Admin login:', data);
    navigate('/admin/dashboard');
  };

  return (
    <LoginForm
      role="admin"
      icon={ShieldCheck}
      title="N&N Admin"
      subtitle="ระบบจัดการหลังบ้าน"
      onSubmit={handleLogin}
    />
  );
}