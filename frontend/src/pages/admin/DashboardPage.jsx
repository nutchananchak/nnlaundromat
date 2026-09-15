import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ClipboardCheck, 
  TrendingUp, 
  Calendar as CalendarIcon, 
  LogOut, 
  CheckCircle2, 
  DollarSign, 
  Power, 
  Search, 
  Clock, 
  Trash2, 
  Sparkles, 
  Bike, 
  Truck, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight, 
  Menu, 
  Image as ImageIcon, 
  CheckCheck,
  Package,
  BarChart3,
  CalendarDays
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

// โลโก้ร้าน N&N Laundromat
const BrandLogo = ({ size = 48 }) => (
  <svg 
    viewBox="0 0 120 120" 
    width={size} 
    height={size} 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className="shrink-0"
  >
    <circle cx="28" cy="18" r="3.5" fill="#60a5fa" opacity="0.8" />
    <circle cx="36" cy="12" r="2" fill="#93c5fd" opacity="0.7" />
    <circle cx="45" cy="16" r="2.8" fill="#3b82f6" opacity="0.8" />
    <circle cx="58" cy="13" r="1.8" fill="#60a5fa" opacity="0.7" />
    <rect x="8" y="32" width="9" height="2.5" rx="1.25" fill="#94a3b8" />
    <rect x="5" y="40" width="12" height="2.5" rx="1.25" fill="#94a3b8" />
    <rect x="9" y="48" width="8" height="2.5" rx="1.25" fill="#94a3b8" />
    <path d="M21 26C21 23.2 23.2 21 26 21H72C74.8 21 77 23.2 77 26V63H21V26Z" fill="#1d61f2" />
    <path d="M77 35H92C93.3 35 94.5 35.5 95.4 36.4L101.6 42.6C102.5 43.5 103 44.8 103 46.1V63H77V35Z" fill="#1d61f2" />
    <path d="M82 40H90C90.7 40 91.3 40.3 91.8 40.7L95.8 44.7C96.2 45.2 96.5 45.8 96.5 46.5V52H82V40Z" fill="#ffffff" />
    <rect x="29" y="26" width="13" height="4.5" rx="1.5" fill="#ffffff" />
    <circle cx="56" cy="28" r="2.2" fill="#ffffff" />
    <circle cx="66" cy="28" r="2.2" fill="#ffffff" />
    <circle cx="49" cy="44.5" r="14" fill="#ffffff" />
    <circle cx="49" cy="44.5" r="11" fill="#1d61f2" />
    <circle cx="49" cy="44.5" r="8" fill="#60a5fa" opacity="0.6" />
    <path d="M43 44C43 41 46 40 49 44C52 48 55 47 55 44" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
    <rect x="100" y="55" width="4" height="6" rx="1.5" fill="#fbbf24" />
    <rect x="19" y="60" width="86" height="4" rx="2" fill="#0f172a" />
    <circle cx="36" cy="63" r="8.5" fill="#0f172a" />
    <circle cx="36" cy="63" r="4" fill="#ffffff" />
    <circle cx="86" cy="63" r="8.5" fill="#0f172a" />
    <circle cx="86" cy="63" r="4" fill="#ffffff" />
    <text x="60" y="85" textAnchor="middle" fill="#1d61f2" fontSize="13" fontWeight="900" fontFamily="sans-serif" letterSpacing="1">
      N&amp;N
    </text>
    <text x="60" y="97" textAnchor="middle" fill="#0f172a" fontSize="8.5" fontWeight="800" fontFamily="sans-serif" letterSpacing="2.5">
      LAUNDROMAT
    </text>
    <text x="60" y="106" textAnchor="middle" fill="#64748b" fontSize="6.5" fontWeight="700" fontFamily="sans-serif" letterSpacing="1.5">
      DELIVERY SERVICE
    </text>
  </svg>
);

const thaiMonths = [
  { value: 0, label: 'มกราคม', short: 'ม.ค.' },
  { value: 1, label: 'กุมภาพันธ์', short: 'ก.พ.' },
  { value: 2, label: 'มีนาคม', short: 'มี.ค.' },
  { value: 3, label: 'เมษายน', short: 'เม.ย.' },
  { value: 4, label: 'พฤษภาคม', short: 'พ.ค.' },
  { value: 5, label: 'มิถุนายน', short: 'มิ.ย.' },
  { value: 6, label: 'กรกฎาคม', short: 'ก.ค.' },
  { value: 7, label: 'สิงหาคม', short: 'ส.ค.' },
  { value: 8, label: 'กันยายน', short: 'ก.ย.' },
  { value: 9, label: 'ตุลาคม', short: 'ต.ค.' },
  { value: 10, label: 'พฤศจิกายน', short: 'พ.ย.' },
  { value: 11, label: 'ธันวาคม', short: 'ธ.ค.' },
];

const DashboardPage = () => {
  const navigate = useNavigate();
  const { orders, setOrders } = useApp ? useApp() : {};

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [activeAdmin] = useState(() => {
    try {
      const saved = localStorage.getItem('currentAdmin');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  useEffect(() => {
    if (!activeAdmin) {
      navigate('/login/admin', { replace: true });
    }
  }, [activeAdmin, navigate]);

  const [activeTab, setActiveTab] = useState('slips');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSlipModal, setSelectedSlipModal] = useState(null);

  // ตัวเลือกกราฟ: 'daily' | 'weekly' | 'by_month'
  const [chartViewMode, setChartViewMode] = useState('daily');
  
  // State เลือกเดือนที่ต้องการดูข้อมูล (ค่าเริ่มต้นเป็นเดือนปัจจุบัน)
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  const riderList = [
    { id: 'RD-01', name: 'วรรณา สีดา', phone: '089-111-2233' },
    { id: 'RD-02', name: 'วันดี ทองอ่อน', phone: '081-444-5566' },
    { id: 'RD-03', name: 'สตาร์ วินเพียว', phone: '086-777-8899' },
  ];

  const [selectedRiders, setSelectedRiders] = useState({});

  const [isStoreOpen, setIsStoreOpen] = useState(() => {
    const saved = localStorage.getItem('storeServiceStatus');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [closedDates, setClosedDates] = useState(() => {
    try {
      const saved = localStorage.getItem('closedDates');
      return saved ? JSON.parse(saved) : ['2026-09-15', '2026-09-16'];
    } catch (e) {
      return [];
    }
  });

  if (!activeAdmin) return null;

  const getThaiRealTimestamp = () => {
    const now = new Date();
    const d = new Intl.DateTimeFormat('th-TH', { day: 'numeric', month: 'short', year: 'numeric' }).format(now);
    const t = new Intl.DateTimeFormat('th-TH', { hour: '2-digit', minute: '2-digit', hour12: false }).format(now);
    return `${d}, ${t} น.`;
  };

  const pendingSlipOrders = (orders || []).filter(o => 
    Number(o.statusStep) === 1 && 
    (String(o.id).toLowerCase().includes(searchTerm.toLowerCase()) || 
     (o.customerName && o.customerName.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  const washingOrders = (orders || []).filter(o => Number(o.statusStep) === 5);
  const deliveredOrders = (orders || []).filter(o => Number(o.statusStep) === 7 || o.status === 'completed');

  // =========================================================================
  // คำนวณสรุปรายรับและข้อมูลเดือนที่เลือก
  // =========================================================================
  const { 
    dailyRevenue, 
    weeklyRevenue, 
    selectedMonthRevenue, 
    totalRevenue, 
    revenueOrders,
    chartData
  } = useMemo(() => {
    const now = new Date();
    const currentDay = now.getDate();
    const currentMonthShort = new Intl.DateTimeFormat('th-TH', { month: 'short' }).format(now);

    const chosenMonthObj = thaiMonths.find(m => m.value === Number(selectedMonth)) || thaiMonths[now.getMonth()];
    const chosenMonthShort = chosenMonthObj.short;

    const validOrders = (orders || []).filter(o => 
      !o.paymentRejected && 
      (o.paymentVerified === true || Number(o.statusStep) >= 3 || Number(o.statusStep) === 7 || o.status === 'completed')
    );

    let daily = 0;
    let weekly = 0;
    let chosenMonthTotal = 0;
    let total = 0;

    const hourlyMap = {
      '08:00': 0, '10:00': 0, '12:00': 0, '14:00': 0, '16:00': 0, '18:00': 0, '20:00': 0, '22:00': 0
    };

    const weekDays = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'];
    const weeklyMap = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      weeklyMap[weekDays[d.getDay()]] = 0;
    }

    const monthWeeksMap = {
      'สัปดาห์ 1': 0,
      'สัปดาห์ 2': 0,
      'สัปดาห์ 3': 0,
      'สัปดาห์ 4': 0
    };

    validOrders.forEach((o) => {
      const amount = Number(o.totalPrice || o.price || 0);
      total += amount;

      const dateStr = String(o.deliveredAt || o.verifiedAt || o.createdAt || '').replace(/[\s\u00A0\u202F]+/g, ' ');

      // 1. ตรวจสอบวันนี้
      const isToday = dateStr.includes(`${currentDay} ${currentMonthShort}`) || dateStr.includes('วันนี้');
      if (isToday) {
        daily += amount;
        const hourMatched = Object.keys(hourlyMap).find(h => dateStr.includes(h.slice(0, 2))) || '14:00';
        hourlyMap[hourMatched] += amount;
      }

      // 2. ตรวจสอบว่าตรงกับเดือนที่เลือกดูหรือไม่
      if (dateStr.includes(chosenMonthShort)) {
        chosenMonthTotal += amount;
        
        // แยกตามสัปดาห์ของเดือนที่เลือก (อิงจากวันที่สั่ง)
        const dayMatch = dateStr.match(/\b(\d{1,2})\b/);
        const dayNum = dayMatch ? parseInt(dayMatch[1], 10) : 15;

        if (dayNum <= 7) monthWeeksMap['สัปดาห์ 1'] += amount;
        else if (dayNum <= 14) monthWeeksMap['สัปดาห์ 2'] += amount;
        else if (dayNum <= 21) monthWeeksMap['สัปดาห์ 3'] += amount;
        else monthWeeksMap['สัปดาห์ 4'] += amount;
      }

      // 3. รอบสัปดาห์ล่าสุด
      weekly += amount;
      const todayDayName = weekDays[now.getDay()];
      weeklyMap[todayDayName] = (weeklyMap[todayDayName] || 0) + amount;
    });

    return {
      dailyRevenue: daily,
      weeklyRevenue: weekly,
      selectedMonthRevenue: chosenMonthTotal,
      totalRevenue: total,
      revenueOrders: validOrders,
      chartData: {
        daily: Object.entries(hourlyMap).map(([label, val]) => ({ label, val })),
        weekly: Object.entries(weeklyMap).map(([label, val]) => ({ label, val })),
        by_month: Object.entries(monthWeeksMap).map(([label, val]) => ({ label, val }))
      }
    };
  }, [orders, selectedMonth]);

  const handleApproveSlip = (orderId) => {
    const chosenRiderId = selectedRiders[orderId] || riderList[0].id;
    const chosenRider = riderList.find(r => r.id === chosenRiderId) || riderList[0];
    const realTimeNow = getThaiRealTimestamp();

    if (!setOrders) return;
    setOrders(prev => prev.map(order => {
      if (String(order.id) === String(orderId)) {
        return {
          ...order,
          statusStep: 3,
          statusTitle: 'ไรเดอร์ได้รับมอบหมาย กำลังไปรับผ้า',
          status: 'in_progress',
          paymentVerified: true,
          paymentRejected: false,
          rejectReason: null,
          verifiedAt: realTimeNow,
          rider: chosenRider
        };
      }
      return order;
    }));

    let currentNotices = [];
    try {
      currentNotices = JSON.parse(localStorage.getItem('customerNotifications') || '[]');
    } catch (e) {
      currentNotices = [];
    }

    const clearedNotices = currentNotices.map(n => {
      if (String(n.orderId) === String(orderId) && n.type === 'alert') {
        return { ...n, isRead: true };
      }
      return n;
    });

    const newNotice = {
      id: Date.now(),
      orderId,
      title: 'สลิปได้รับการอนุมัติเรียบร้อย',
      message: `ออเดอร์ #${orderId} ยอดเงินถูกต้อง ไรเดอร์ (${chosenRider.name}) กำลังเดินทางไปรับผ้า`,
      time: realTimeNow,
      type: 'success',
      isRead: true
    };

    localStorage.setItem('customerNotifications', JSON.stringify([newNotice, ...clearedNotices]));
    alert(`อนุมัติคำสั่งซื้อ #${orderId} เรียบร้อยแล้ว มอบหมายให้ไรเดอร์ "${chosenRider.name}" ดูแลงาน`);
  };

  const handleRejectSlip = (orderId) => {
    const reason = prompt('ระบุสาเหตุที่ปฏิเสธสลิป (เช่น ยอดไม่ตรง, ภาพไม่ชัดเจน, สลิปซ้ำ):');
    if (!reason) return;

    const realTimeNow = getThaiRealTimestamp();

    if (!setOrders) return;
    setOrders(prev => prev.map(order => {
      if (String(order.id) === String(orderId)) {
        return {
          ...order,
          paymentRejected: true,
          rejectReason: reason,
          rejectedAt: realTimeNow,
          statusTitle: 'สลิปไม่ถูกต้อง (รอแนบสลิปใหม่)'
        };
      }
      return order;
    }));

    const newNotice = {
      id: Date.now(),
      orderId,
      title: 'สลิปการโอนเงินไม่ถูกต้อง',
      message: `ออเดอร์ #${orderId} ถูกปฏิเสธเนื่องจาก "${reason}" กรุณาแนบสลิปใหม่ในหน้าแรกของแอป`,
      time: realTimeNow,
      type: 'alert',
      isRead: false
    };

    let currentNotices = [];
    try {
      currentNotices = JSON.parse(localStorage.getItem('customerNotifications') || '[]');
    } catch (e) {
      currentNotices = [];
    }

    localStorage.setItem('customerNotifications', JSON.stringify([newNotice, ...currentNotices]));
    alert(`ปฏิเสธสลิป #${orderId} เรียบร้อยแล้ว ระบบได้ส่งการแจ้งเตือนไปยังลูกค้าแล้ว`);
  };

  const handleCompleteWashing = (orderId) => {
    const realTimeNow = getThaiRealTimestamp();

    if (!setOrders) return;
    setOrders(prev => prev.map(order => {
      if (String(order.id) === String(orderId)) {
        return {
          ...order,
          statusStep: 6,
          statusTitle: 'ผ้าซักอบเสร็จแล้ว ไรเดอร์กำลังนำส่งคืนลูกค้า',
          washedAt: realTimeNow
        };
      }
      return order;
    }));
    alert(`อัปเดตคำสั่งซื้อ #${orderId} เป็น "ซักอบเสร็จแล้ว" ไรเดอร์จะได้รับแจ้งเตือนให้นำส่งคืนลูกค้าทันที`);
  };

  const toggleStoreStatus = () => {
    const updated = !isStoreOpen;
    setIsStoreOpen(updated);
    localStorage.setItem('storeServiceStatus', JSON.stringify(updated));
  };

  const handleToggleClosedDate = (dateStr) => {
    let updated;
    if (closedDates.includes(dateStr)) {
      updated = closedDates.filter(d => d !== dateStr);
    } else {
      updated = [...closedDates, dateStr];
    }
    setClosedDates(updated);
    localStorage.setItem('closedDates', JSON.stringify(updated));
  };

  const handleLogout = () => {
    if (window.confirm('ต้องการออกจากระบบผู้ดูแลหรือไม่?')) {
      localStorage.removeItem('currentAdmin');
      localStorage.removeItem('rememberAdmin');
      navigate('/login/admin', { replace: true });
    }
  };

  const activeGraphList = chartData[chartViewMode] || chartData.daily;
  const maxGraphVal = Math.max(...activeGraphList.map(item => item.val), 100);

  return (
    <div className="flex h-screen w-screen bg-slate-100 font-body text-slate-800 overflow-hidden text-base">
      
      {/* 1. Sidebar */}
      <aside 
        className={`${
          isSidebarOpen ? 'w-72' : 'w-20'
        } bg-slate-900 text-white flex flex-col justify-between shrink-0 shadow-2xl z-20 transition-all duration-300 relative`}
      >
        <button
          type="button"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute -right-3.5 top-7 w-7 h-7 rounded-full bg-[#1d61f2] hover:bg-blue-600 text-white shadow-md flex items-center justify-center cursor-pointer z-30 transition-transform active:scale-90"
          title={isSidebarOpen ? 'ย่อแถบเมนู' : 'ขยายแถบเมนู'}
        >
          {isSidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>

        <div>
          <div className="p-4 border-b border-slate-800 flex items-center gap-3 bg-slate-950/40 min-h-[80px]">
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center p-1 shadow-md shrink-0">
              <BrandLogo size={42} />
            </div>
            {isSidebarOpen && (
              <div className="min-w-0 transition-opacity duration-200">
                <h2 className="font-display font-normal text-base text-white tracking-normal leading-tight truncate">
                  N&amp;N Laundromat
                </h2>
                <span className="text-[11px] text-blue-400 font-semibold tracking-wide block mt-0.5">
                  ADMIN HUB
                </span>
              </div>
            )}
          </div>

          <nav className="p-3 space-y-2">
            <button
              onClick={() => setActiveTab('slips')}
              className={`w-full flex items-center ${isSidebarOpen ? 'justify-between px-3.5' : 'justify-center px-0'} py-3 rounded-2xl text-sm font-bold transition cursor-pointer relative group ${
                activeTab === 'slips' 
                  ? 'bg-[#1d61f2] text-white shadow-md shadow-blue-500/20' 
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <ClipboardCheck size={20} className="shrink-0" />
                {isSidebarOpen && <span className="truncate">ตรวจสอบสลิป</span>}
              </div>
              {pendingSlipOrders.length > 0 && (
                <span className={`${isSidebarOpen ? 'px-2 py-0.5 text-xs' : 'absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-[10px]'} bg-amber-500 text-white font-black rounded-full`}>
                  {pendingSlipOrders.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('washing')}
              className={`w-full flex items-center ${isSidebarOpen ? 'justify-between px-3.5' : 'justify-center px-0'} py-3 rounded-2xl text-sm font-bold transition cursor-pointer relative group ${
                activeTab === 'washing' 
                  ? 'bg-[#1d61f2] text-white shadow-md shadow-blue-500/20' 
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Sparkles size={20} className="shrink-0" />
                {isSidebarOpen && <span className="truncate">ผ้ากำลังซักอบ</span>}
              </div>
              {washingOrders.length > 0 && (
                <span className={`${isSidebarOpen ? 'px-2 py-0.5 text-xs' : 'absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-[10px]'} bg-blue-500 text-white font-black rounded-full`}>
                  {washingOrders.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('completed')}
              className={`w-full flex items-center ${isSidebarOpen ? 'justify-between px-3.5' : 'justify-center px-0'} py-3 rounded-2xl text-sm font-bold transition cursor-pointer relative group ${
                activeTab === 'completed' 
                  ? 'bg-[#1d61f2] text-white shadow-md shadow-blue-500/20' 
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <CheckCheck size={20} className="shrink-0" />
                {isSidebarOpen && <span className="truncate">ส่งมอบสำเร็จแล้ว</span>}
              </div>
              {deliveredOrders.length > 0 && (
                <span className={`${isSidebarOpen ? 'px-2 py-0.5 text-xs' : 'absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-[10px]'} bg-emerald-600 text-white font-black rounded-full`}>
                  {deliveredOrders.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`w-full flex items-center ${isSidebarOpen ? 'gap-3 px-3.5' : 'justify-center px-0'} py-3 rounded-2xl text-sm font-bold transition cursor-pointer relative group ${
                activeTab === 'analytics' 
                  ? 'bg-[#1d61f2] text-white shadow-md shadow-blue-500/20' 
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <TrendingUp size={20} className="shrink-0" />
              {isSidebarOpen && <span className="truncate">สรุปรายรับ &amp; กราฟ</span>}
            </button>

            <button
              onClick={() => setActiveTab('calendar')}
              className={`w-full flex items-center ${isSidebarOpen ? 'gap-3 px-3.5' : 'justify-center px-0'} py-3 rounded-2xl text-sm font-bold transition cursor-pointer relative group ${
                activeTab === 'calendar' 
                  ? 'bg-[#1d61f2] text-white shadow-md shadow-blue-500/20' 
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <CalendarIcon size={20} className="shrink-0" />
              {isSidebarOpen && <span className="truncate">ปฏิทินวันหยุด</span>}
            </button>
          </nav>
        </div>

        <div className="p-3.5 border-t border-slate-800 bg-slate-950/60">
          <div className={`flex items-center ${isSidebarOpen ? 'justify-between' : 'justify-center'}`}>
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-[#1d61f2]/20 border border-[#1d61f2]/40 flex items-center justify-center text-xs font-bold text-blue-400 shrink-0">
                ADM
              </div>
              {isSidebarOpen && (
                <div className="text-left min-w-0">
                  <span className="text-xs font-bold text-slate-100 block truncate max-w-[110px]">{activeAdmin.name}</span>
                  <span className="text-[10px] text-slate-400 block">{activeAdmin.id}</span>
                </div>
              )}
            </div>
            {isSidebarOpen && (
              <button
                type="button"
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-xl transition cursor-pointer"
                title="ออกจากระบบ"
              >
                <LogOut size={16} />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="h-20 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 transition cursor-pointer"
            >
              <Menu size={18} />
            </button>
            <div>
              <h1 className="font-display font-bold text-lg text-slate-900 leading-tight">
                {activeTab === 'slips' && 'ตรวจสอบสลิปและมอบหมายไรเดอร์'}
                {activeTab === 'washing' && 'แผนกซัก-อบผ้าของทางร้าน'}
                {activeTab === 'completed' && 'รายการที่ไรเดอร์ส่งมอบผ้าสำเร็จแล้ว'}
                {activeTab === 'analytics' && 'ภาพรวมรายรับและกราฟสถิติ'}
                {activeTab === 'calendar' && 'จัดการตารางเวลาและวันหยุดบริการ'}
              </h1>
              <p className="text-xs text-slate-500 font-normal">
                ระบบบริหารจัดการสำหรับเจ้าหน้าที่ N&amp;N Laundromat
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="ค้นหาเลขออเดอร์, ชื่อลูกค้า..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs w-64 focus:outline-none focus:border-[#1d61f2] focus:bg-white transition"
              />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6">

          {/* ======================= แท็บ 1: ตรวจสอบสลิป ======================= */}
          {activeTab === 'slips' && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-sm text-slate-900">รายการสลิปที่รอตรวจสอบและมอบหมายงาน</span>
                    <span className="bg-amber-100 text-amber-800 text-xs font-extrabold px-2.5 py-0.5 rounded-full">
                      {pendingSlipOrders.length} รายการ
                    </span>
                  </div>
                </div>

                {pendingSlipOrders.length === 0 ? (
                  <div className="py-24 text-center text-slate-400 flex flex-col items-center gap-3">
                    <CheckCircle2 size={44} className="text-emerald-500" />
                    <span className="text-sm font-semibold">ไม่มีรายการสลิปค้างตรวจสอบในขณะนี้</span>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                      <thead>
                        <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold text-xs uppercase tracking-wider whitespace-nowrap">
                          <th className="py-3.5 px-4">เลขออเดอร์</th>
                          <th className="py-3.5 px-4">ข้อมูลลูกค้า</th>
                          <th className="py-3.5 px-4">บริการ</th>
                          <th className="py-3.5 px-4">ยอดโอน</th>
                          <th className="py-3.5 px-4 text-center">หลักฐานสลิป</th>
                          <th className="py-3.5 px-4">มอบหมายไรเดอร์</th>
                          <th className="py-3.5 px-4 text-center">ดำเนินการ</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {pendingSlipOrders.map(order => {
                          const currentSlipImg = order.slipImage || order.paymentSlip || order.slip || null;
                          const selectedRiderId = selectedRiders[order.id] || riderList[0].id;

                          return (
                            <tr key={order.id} className="hover:bg-blue-50/30 transition-colors">
                              <td className="py-4 px-4 whitespace-nowrap">
                                <span className="font-extrabold text-[#1d61f2] text-sm tracking-tight">
                                  #{order.id}
                                </span>
                              </td>

                              <td className="py-4 px-4 whitespace-nowrap">
                                <div className="flex items-baseline gap-1.5">
                                  <span className="font-bold text-slate-800 text-sm">
                                    {order.customerName || 'คุณลูกค้า'}
                                  </span>
                                  <span className="text-xs text-slate-400 font-normal">
                                    ({order.customerPhone || '-'})
                                  </span>
                                </div>
                              </td>

                              <td className="py-4 px-4 whitespace-nowrap">
                                <span className="font-semibold text-slate-700 text-xs">
                                  {order.serviceName}
                                </span>
                                {order.packageName && (
                                  <span className="text-[11px] text-slate-400 ml-1 font-normal">
                                    • {order.packageName}
                                  </span>
                                )}
                              </td>

                              <td className="py-4 px-4 whitespace-nowrap">
                                <span className="font-black text-slate-900 text-sm">
                                  {(order.totalPrice || order.price || 0).toLocaleString()} ฿
                                </span>
                              </td>

                              <td className="py-4 px-4 text-center whitespace-nowrap">
                                <button
                                  type="button"
                                  onClick={() => setSelectedSlipModal(order)}
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#1d61f2] rounded-xl border border-blue-200/80 transition cursor-pointer"
                                >
                                  {currentSlipImg ? (
                                    <img 
                                      src={currentSlipImg} 
                                      alt="สลิป" 
                                      className="w-6 h-6 rounded-lg object-cover border border-blue-300"
                                    />
                                  ) : (
                                    <div className="w-6 h-6 rounded-lg bg-blue-100 flex items-center justify-center text-[#1d61f2]">
                                      <ImageIcon size={14} />
                                    </div>
                                  )}
                                  <span className="text-xs font-bold">ดูสลิป</span>
                                </button>
                              </td>

                              <td className="py-4 px-4 whitespace-nowrap">
                                <div className="relative inline-flex items-center">
                                  <div className="w-7 h-7 rounded-lg bg-[#1d61f2]/10 text-[#1d61f2] flex items-center justify-center shrink-0 absolute left-2 pointer-events-none">
                                    <Bike size={14} />
                                  </div>
                                  <select
                                    value={selectedRiderId}
                                    onChange={(e) => setSelectedRiders({ ...selectedRiders, [order.id]: e.target.value })}
                                    className="appearance-none bg-slate-50 border border-slate-200 hover:border-[#1d61f2] focus:border-[#1d61f2] rounded-xl pl-10 pr-8 py-1.5 text-xs font-bold text-slate-700 outline-none cursor-pointer transition shadow-2xs"
                                  >
                                    {riderList.map(r => (
                                      <option key={r.id} value={r.id}>
                                        {r.name} ({r.id})
                                      </option>
                                    ))}
                                  </select>
                                  <ChevronDown size={14} className="text-slate-400 absolute right-2.5 pointer-events-none" />
                                </div>
                              </td>

                              <td className="py-4 px-4 text-center whitespace-nowrap space-x-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleRejectSlip(order.id)}
                                  className="px-3 py-1.5 border border-red-200 text-red-600 hover:bg-red-50 active:scale-95 rounded-xl font-bold text-xs transition cursor-pointer"
                                >
                                  ปฏิเสธ
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleApproveSlip(order.id)}
                                  className="px-3.5 py-1.5 bg-[#1d61f2] hover:bg-blue-700 active:scale-95 text-white rounded-xl font-bold text-xs shadow-xs transition cursor-pointer"
                                >
                                  อนุมัติงาน
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ======================= แท็บ 2: แผนกผ้าซักอบ ======================= */}
          {activeTab === 'washing' && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6">
                <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
                  <div>
                    <h3 className="font-bold text-base text-slate-900">รายการผ้าที่กำลังดำเนินการซัก-อบที่ร้าน</h3>
                    <p className="text-xs text-slate-500 mt-0.5">เมื่อผ้าแห้งสนิทและพับเรียบร้อยแล้ว ให้กดปุ่มเพื่อเรียกไรเดอร์ส่งคืนลูกค้า</p>
                  </div>
                  <span className="bg-blue-50 text-[#1d61f2] font-bold text-xs px-3 py-1 rounded-full">
                    {washingOrders.length} รายการ
                  </span>
                </div>

                {washingOrders.length === 0 ? (
                  <div className="py-20 text-center text-slate-400 flex flex-col items-center gap-2">
                    <Sparkles size={40} className="text-slate-300" />
                    <span>ไม่มีรายการผ้าที่กำลังซักอบในขณะนี้</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {washingOrders.map(order => (
                      <div key={order.id} className="p-5 rounded-2xl border border-blue-100 bg-blue-50/30 flex flex-col justify-between gap-4">
                        <div>
                          <div className="flex justify-between items-center">
                            <span className="font-extrabold text-base text-[#1d61f2]">ออเดอร์ #{order.id}</span>
                            <span className="text-xs font-bold bg-white text-blue-800 border border-blue-200 px-2.5 py-0.5 rounded-lg">
                              {order.serviceName}
                            </span>
                          </div>
                          <div className="mt-3 space-y-1 text-xs text-slate-600">
                            <div><span className="font-bold">ลูกค้า:</span> {order.customerName || 'คุณลูกค้า'} ({order.customerPhone || '-'})</div>
                            <div><span className="font-bold">ที่อยู่จัดส่ง:</span> {order.address}</div>
                            <div><span className="font-bold text-blue-700">ไรเดอร์ผู้ดูแล:</span> {order.rider?.name || 'สมชาย ส่งไว'}</div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleCompleteWashing(order.id)}
                          className="w-full py-2.5 bg-[#1d61f2] hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <Truck size={16} /> ซักอบเสร็จแล้ว - ส่งงานให้ไรเดอร์นำส่งคืน
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ======================= แท็บ 3: รายการที่ส่งมอบสำเร็จแล้ว ======================= */}
          {activeTab === 'completed' && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6">
                <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
                  <div>
                    <h3 className="font-bold text-base text-slate-900">ประวัติออเดอร์ที่ไรเดอร์ส่งมอบสำเร็จแล้ว</h3>
                    <p className="text-xs text-slate-500 mt-0.5">ข้อมูลอัปเดตแบบเรียลไทม์จากแอปพลิเคชันของไรเดอร์เมื่อกดจบงาน</p>
                  </div>
                  <span className="bg-emerald-50 text-emerald-700 font-bold text-xs px-3 py-1 rounded-full">
                    {deliveredOrders.length} รายการสำเร็จ
                  </span>
                </div>

                {deliveredOrders.length === 0 ? (
                  <div className="py-20 text-center text-slate-400 flex flex-col items-center gap-2">
                    <CheckCheck size={40} className="text-slate-300" />
                    <span>ยังไม่มีออเดอร์ที่ส่งมอบสำเร็จในขณะนี้</span>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                      <thead>
                        <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold text-xs uppercase tracking-wider whitespace-nowrap">
                          <th className="py-3.5 px-4">เลขออเดอร์</th>
                          <th className="py-3.5 px-4">ลูกค้า</th>
                          <th className="py-3.5 px-4">บริการ</th>
                          <th className="py-3.5 px-4">ยอดเงินสุทธิ</th>
                          <th className="py-3.5 px-4">ไรเดอร์ผู้ส่งมอบ</th>
                          <th className="py-3.5 px-4">เวลาที่ส่งมอบสำเร็จจริง</th>
                          <th className="py-3.5 px-4 text-center">หลักฐาน</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {deliveredOrders.map(order => (
                          <tr key={order.id} className="hover:bg-emerald-50/20 transition-colors">
                            <td className="py-4 px-4 whitespace-nowrap">
                              <span className="font-extrabold text-[#1d61f2] text-sm">#{order.id}</span>
                            </td>
                            <td className="py-4 px-4 whitespace-nowrap">
                              <span className="font-bold text-slate-800 text-xs block">{order.customerName || 'คุณลูกค้า'}</span>
                              <span className="text-[11px] text-slate-400">{order.customerPhone || '-'}</span>
                            </td>
                            <td className="py-4 px-4 whitespace-nowrap text-xs text-slate-700">
                              {order.serviceName}
                            </td>
                            <td className="py-4 px-4 whitespace-nowrap font-bold text-slate-900 text-xs">
                              {(order.totalPrice || order.price || 0).toLocaleString()} ฿
                            </td>
                            <td className="py-4 px-4 whitespace-nowrap">
                              <span className="text-xs font-bold text-blue-700 block">
                                {order.deliveryRiderName || order.rider?.name || 'ไรเดอร์ประจำร้าน'}
                              </span>
                            </td>
                            <td className="py-4 px-4 whitespace-nowrap">
                              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                                {order.deliveredAt || 'เสร็จสมบูรณ์'}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-center whitespace-nowrap">
                              {order.proofImage ? (
                                <button
                                  type="button"
                                  onClick={() => setSelectedSlipModal({ ...order, slipImage: order.proofImage })}
                                  className="text-xs text-[#1d61f2] font-bold underline cursor-pointer"
                                >
                                  ดูภาพส่งงาน
                                </button>
                              ) : (
                                <span className="text-[11px] text-slate-400">ไม่มีรูป</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ======================= แท็บ 4: สรุปรายรับ & กราฟสถิติ ======================= */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              
              {/* แถวการ์ดสรุปยอดเงิน 3 การ์ด */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* 1. รายรับประจำวัน */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-400 block tracking-wide">รายรับประจำวัน (วันนี้)</span>
                    <span className="text-3xl font-extrabold text-[#1d61f2] leading-normal block pt-1">
                      {dailyRevenue.toLocaleString()} บาท
                    </span>
                    <span className="text-xs text-slate-500 font-semibold mt-1.5 block">
                      {dailyRevenue > 0 ? 'ชำระพร้อมเพย์สำเร็จ' : 'ยังไม่มีรายการชำระวันนี้'}
                    </span>
                  </div>
                  <div className="w-13 h-13 rounded-2xl bg-blue-50 text-[#1d61f2] flex items-center justify-center shrink-0">
                    <DollarSign size={26} />
                  </div>
                </div>

                {/* 2. รายรับรอบสัปดาห์ */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-400 block tracking-wide">รอบสัปดาห์ (7 วันล่าสุด)</span>
                    <span className="text-3xl font-extrabold text-slate-900 leading-normal block pt-1">
                      {weeklyRevenue.toLocaleString()} บาท
                    </span>
                    <span className="text-xs text-slate-500 font-semibold mt-1.5 block">
                      ยอดสะสมช่วง 7 วันที่ผ่านมา
                    </span>
                  </div>
                  <div className="w-13 h-13 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <TrendingUp size={26} />
                  </div>
                </div>

                {/* 3. รายรับตามเดือนที่เลือก */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-400 block tracking-wide">
                        รายรับเดือน {thaiMonths.find(m => m.value === Number(selectedMonth))?.label}
                      </span>
                    </div>
                    <span className="text-3xl font-extrabold text-slate-900 leading-normal block pt-1">
                      {selectedMonthRevenue.toLocaleString()} บาท
                    </span>
                    <span className="text-xs text-slate-500 font-semibold mt-1.5 block">
                      รอบบัญชีเดือนที่เลือก
                    </span>
                  </div>
                  <div className="w-13 h-13 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                    <CalendarDays size={26} />
                  </div>
                </div>
              </div>

              {/* ================= กราฟสถิติรายรับแบบ Visual Bar Chart ================= */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 flex flex-col gap-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#1d61f2] flex items-center justify-center">
                      <BarChart3 size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-slate-900">
                        แผนภูมิแสดงยอดขาย: {chartViewMode === 'by_month' ? `รายเดือน (${thaiMonths.find(m => m.value === Number(selectedMonth))?.label})` : chartViewMode === 'weekly' ? 'รอบ 7 วันล่าสุด' : 'วันนี้ (รายชั่วโมง)'}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">แผนภูมิแท่งเปรียบเทียบสถิติรายได้ตามช่วงเวลาจริง</p>
                    </div>
                  </div>

                  {/* ตัวควบคุมกราฟ: ปุ่มสลับโหมด + Dropdown เลือกเดือน */}
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="bg-slate-100 p-1 rounded-2xl flex gap-1">
                      <button
                        type="button"
                        onClick={() => setChartViewMode('daily')}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                          chartViewMode === 'daily'
                            ? 'bg-white text-[#1d61f2] shadow-xs'
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        วันนี้ (รายชม.)
                      </button>
                      <button
                        type="button"
                        onClick={() => setChartViewMode('weekly')}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                          chartViewMode === 'weekly'
                            ? 'bg-white text-[#1d61f2] shadow-xs'
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        7 วันล่าสุด
                      </button>
                      <button
                        type="button"
                        onClick={() => setChartViewMode('by_month')}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                          chartViewMode === 'by_month'
                            ? 'bg-white text-[#1d61f2] shadow-xs'
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        ดูรายเดือน
                      </button>
                    </div>

                    {/* Dropdown เลือกเดือน */}
                    <div className="relative inline-flex items-center">
                      <select
                        value={selectedMonth}
                        onChange={(e) => {
                          setSelectedMonth(Number(e.target.value));
                          setChartViewMode('by_month');
                        }}
                        className="appearance-none bg-slate-50 border border-slate-200 hover:border-[#1d61f2] focus:border-[#1d61f2] rounded-2xl pl-3 pr-8 py-2 text-xs font-bold text-slate-700 outline-none cursor-pointer transition shadow-2xs"
                      >
                        {thaiMonths.map(m => (
                          <option key={m.value} value={m.value}>
                            เดือน{m.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="text-slate-400 absolute right-2.5 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* ตัวกราฟแท่ง */}
                <div className="w-full pt-4">
                  <div className="h-60 w-full flex items-end justify-between gap-3 sm:gap-6 px-2 sm:px-6 border-b border-slate-200 pb-2">
                    {activeGraphList.map((item, idx) => {
                      const heightPercent = maxGraphVal > 0 ? Math.round((item.val / maxGraphVal) * 100) : 0;
                      const hasValue = item.val > 0;

                      return (
                        <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                          <div className="absolute -top-9 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded-lg pointer-events-none whitespace-nowrap shadow-md z-10">
                            {item.val.toLocaleString()} บาท
                          </div>

                          {hasValue && (
                            <span className="text-[10px] font-bold text-[#1d61f2] mb-1.5 animate-in fade-in duration-200">
                              {item.val}฿
                            </span>
                          )}

                          <div 
                            className={`w-full max-w-[48px] rounded-t-xl transition-all duration-500 ${
                              hasValue 
                                ? 'bg-gradient-to-t from-[#1d61f2] to-blue-400 shadow-sm shadow-blue-500/20 group-hover:brightness-110' 
                                : 'bg-slate-100 hover:bg-slate-200'
                            }`}
                            style={{ height: `${Math.max(heightPercent, 6)}%` }}
                          />

                          <span className={`text-xs mt-3 block font-semibold transition ${
                            hasValue ? 'text-slate-800 font-bold' : 'text-slate-400'
                          }`}>
                            {item.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* สถิติย่อยใต้กราฟ */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                  <div className="p-3.5 bg-slate-50 rounded-2xl flex items-center justify-between">
                    <span className="text-slate-500">ออเดอร์ที่สร้างรายได้</span>
                    <span className="font-extrabold text-slate-800">{revenueOrders.length} รายการ</span>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-2xl flex items-center justify-between">
                    <span className="text-slate-500">ยอดเฉลี่ยต่อบิล</span>
                    <span className="font-extrabold text-[#1d61f2]">
                      {revenueOrders.length > 0 ? Math.round(totalRevenue / revenueOrders.length).toLocaleString() : 0} ฿
                    </span>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-2xl flex items-center justify-between">
                    <span className="text-slate-500">เดือนที่กำลังแสดงผล</span>
                    <span className="font-bold text-purple-700">
                      {thaiMonths.find(m => m.value === Number(selectedMonth))?.label}
                    </span>
                  </div>
                </div>
              </div>

              {/* รายการออเดอร์ที่คำนวณในรายรับ */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                  <div>
                    <h3 className="font-bold text-base text-slate-900">รายการคำสั่งซื้อที่คิดเป็นรายได้</h3>
                    <p className="text-xs text-slate-500 mt-0.5">รวมออเดอร์ที่โอนชำระเงินเรียบร้อยและงานที่ส่งมอบแล้ว</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">ยอดรวมสะสมทั้งหมด</span>
                    <span className="text-lg font-black text-emerald-600">{totalRevenue.toLocaleString()} บาท</span>
                  </div>
                </div>

                {revenueOrders.length === 0 ? (
                  <div className="py-16 text-center text-slate-400 flex flex-col items-center gap-2">
                    <Package size={36} className="text-slate-300" />
                    <span className="text-sm font-semibold">ยังไม่มีคำสั่งซื้อที่เสร็จสิ้นสมบูรณ์เพื่อคิดยอดรายรับ</span>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {revenueOrders.map((o) => (
                      <div key={o.id} className="py-3.5 flex items-center justify-between text-xs hover:bg-slate-50/50 px-2 rounded-xl transition">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shrink-0">
                            ✓
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-slate-900 text-sm">#{o.id}</span>
                              <span className="text-slate-600 font-semibold">{o.serviceName}</span>
                              {o.packageName && <span className="text-[11px] text-slate-400">({o.packageName})</span>}
                            </div>
                            <span className="text-[11px] text-slate-400 mt-0.5 block">
                              เวลาที่ทำรายการ: {o.deliveredAt || o.verifiedAt || o.createdAt || '-'}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-extrabold text-[#1d61f2] text-sm block">
                            +{(Number(o.totalPrice || o.price) || 0).toLocaleString()} ฿
                          </span>
                          <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                            พร้อมเพย์สำเร็จ
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* ======================= แท็บ 5: ปฏิทินร้าน ======================= */}
          {activeTab === 'calendar' && (
            <div className="max-w-4xl space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-slate-900">การเปิด-ปิดระบบรับออเดอร์ทันที (Master Switch)</h3>
                  <p className="text-sm text-slate-500 mt-1">
                    หากสั่งปิดระบบ หน้าแรกและหน้าสั่งซักผ้าของลูกค้าจะงดรับคำสั่งซื้อใหม่ทันที
                  </p>
                  <span className={`inline-block text-xs font-bold px-3 py-1 rounded-lg mt-3 ${
                    isStoreOpen ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
                  }`}>
                    {isStoreOpen ? 'ระบบกำลังเปิดรับออเดอร์ตามปกติ' : 'ระบบปิดให้บริการชั่วคราว'}
                  </span>
                </div>

                <button
                  onClick={toggleStoreStatus}
                  className={`px-5 py-2.5 rounded-2xl font-bold text-sm flex items-center gap-2 transition cursor-pointer ${
                    isStoreOpen 
                      ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100' 
                      : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm'
                  }`}
                >
                  <Power size={16} />
                  {isStoreOpen ? 'สั่งปิดระบบชั่วคราว' : 'สั่งเปิดระบบให้บริการ'}
                </button>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-base text-slate-900 mb-2">กำหนดวันหยุดร้านล่วงหน้า</h3>
                <div className="flex items-center gap-3 max-w-md mb-6">
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:border-[#1d61f2]"
                  />
                  <button
                    onClick={() => handleToggleClosedDate(selectedDate)}
                    className="px-5 py-2.5 bg-[#1d61f2] hover:bg-blue-700 text-white font-bold text-sm rounded-2xl transition cursor-pointer shadow-sm"
                  >
                    {closedDates.includes(selectedDate) ? 'ยกเลิกวันหยุดนี้' : 'บันทึกเป็นวันหยุด'}
                  </button>
                </div>

                <div className="border-t border-slate-100 pt-5">
                  <span className="text-sm font-bold text-slate-700 block mb-3">รายการวันหยุดที่บันทึกไว้:</span>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {closedDates.sort().map(d => (
                      <div key={d} className="flex items-center justify-between p-3 bg-red-50/70 border border-red-100 rounded-2xl text-xs font-bold text-red-700">
                        <span>{d}</span>
                        <button
                          onClick={() => handleToggleClosedDate(d)}
                          className="text-red-400 hover:text-red-700 cursor-pointer p-1"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Modal แสดงรูปสลิป / รูปหลักฐาน */}
      {selectedSlipModal && (
        <div
          className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-150"
          onClick={() => setSelectedSlipModal(null)}
        >
          <div
            className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-bold text-base text-slate-900">หลักฐานภาพถ่าย</h4>
                <span className="text-xs text-[#1d61f2] font-semibold">ออเดอร์ #{selectedSlipModal.id}</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSlipModal(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="w-full min-h-[360px] max-h-[500px] bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden flex items-center justify-center p-2">
              {(selectedSlipModal.slipImage || selectedSlipModal.paymentSlip || selectedSlipModal.proofImage) ? (
                <img
                  src={selectedSlipModal.slipImage || selectedSlipModal.paymentSlip || selectedSlipModal.proofImage}
                  alt={`หลักฐาน #${selectedSlipModal.id}`}
                  className="w-full h-auto max-h-[480px] object-contain rounded-xl shadow-xs"
                />
              ) : (
                <div className="w-full h-full p-6 flex flex-col items-center justify-center text-center bg-white rounded-xl border border-dashed border-slate-300">
                  <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                    <CheckCircle2 size={32} />
                  </div>
                  <span className="font-bold text-base text-slate-800">หลักฐานการชำระเงินพร้อมเพย์</span>
                  <span className="text-xs text-slate-400 mt-0.5">N&amp;N Laundromat Payment</span>
                  <div className="w-full my-4 border-t border-slate-100 pt-3 text-xs text-slate-600 space-y-1 text-left">
                    <div className="flex justify-between"><span>ผู้โอน:</span> <span className="font-bold">{selectedSlipModal.customerName || 'คุณลูกค้า'}</span></div>
                    <div className="flex justify-between"><span>ยอดเงิน:</span> <span className="font-bold text-[#1d61f2]">{(selectedSlipModal.totalPrice || selectedSlipModal.price || 0).toLocaleString()} บาท</span></div>
                    <div className="flex justify-between"><span>เวลาที่แจ้ง:</span> <span>{selectedSlipModal.createdAt || 'ไม่ระบุเวลา'}</span></div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedSlipModal(null)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default DashboardPage;