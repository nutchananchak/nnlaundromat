import { Home, ClipboardList, Bell, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const menus = [
    { icon: Home, label: 'หน้าแรก', path: '/home' },
    { icon: ClipboardList, label: 'ออเดอร์', path: '/orders' },
    { icon: Bell, label: 'แจ้งเตือน', path: '/notifications' },
    { icon: User, label: 'โปรไฟล์', path: '/profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2">
      {menus.map((menu) => {
        const Icon = menu.icon;
        const isActive = location.pathname === menu.path;
        return (
          <button
            key={menu.path}
            onClick={() => navigate(menu.path)}
            className={`flex flex-col items-center text-xs ${
              isActive ? 'text-primary' : 'text-gray-400'
            }`}
          >
            <Icon size={22} />
            <span className="mt-1">{menu.label}</span>
          </button>
        );
      })}
    </nav>
  );
}