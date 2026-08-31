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
    <nav className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-gray-200 flex justify-around py-3 px-2 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] z-50 font-sans">
      {menus.map((menu) => {
        const Icon = menu.icon;
        const isActive = location.pathname === menu.path;
        return (
          <button
            key={menu.path}
            onClick={() => navigate(menu.path)}
            className={`flex flex-col items-center gap-1 transition ${
              isActive ? 'text-[#1d61f2]' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
            <span className={`text-[11px] ${isActive ? 'font-bold' : 'font-medium'}`}>
              {menu.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}