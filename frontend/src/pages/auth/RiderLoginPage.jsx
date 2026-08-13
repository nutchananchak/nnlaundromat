import { useNavigate } from 'react-router-dom';
import { Bike } from 'lucide-react';
import LoginForm from '../../components/auth/LoginForm';

export default function RiderLoginPage() {
  const navigate = useNavigate();

  const handleLogin = (data, setError) => {
    console.log('Rider login:', data);
    navigate('/rider/tasks');
  };

  return (
    <LoginForm
      role="rider"
      icon={Bike}
      title="N&N Rider"
      subtitle="ระบบสำหรับพนักงานรับ-ส่งผ้า"
      onSubmit={handleLogin}
    />
  );
}