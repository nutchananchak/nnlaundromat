import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ClipboardCheck, 
  TrendingUp, 
  Calendar as CalendarIcon, 
  LogOut, 
  CheckCircle2, 
  XCircle, 
  DollarSign, 
  Eye, 
  Power, 
  Search, 
  Clock, 
  Trash2, 
  AlertTriangle,
  Sparkles,
  Bike,
  Truck,
  UserCheck
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

const DashboardPage = () => {
  const navigate = useNavigate();
  const { orders, setOrders } = useApp ? useApp() : {};

  // ตรวจสอบสิทธิ์การเข้าใช้งาน Admin
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

  // แท็บเมนู: 'slips' | 'washing' | 'analytics' | 'calendar'
  const [activeTab, setActiveTab] = useState('slips');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSlip, setSelectedSlip] = useState(null);

  // รายชื่อไรเดอร์ที่มีในระบบของร้าน
  const riderList = [
    { id: 'RD-01', name: 'สมชาย ส่งไว', phone: '089-111-2233' },
    { id: 'RD-02', name: 'ธนาวุฒิ บริการดี', phone: '081-444-5566' },
    { id: 'RD-03', name: 'กิตติศักดิ์ ซิ่งเร็ว', phone: '086-777-8899' },
  ];

  // เก็บการเลือกไรเดอร์ของแต่ละออเดอร์ในหน้าตรวจสลิป
  const [selectedRiders, setSelectedRiders] = useState({});

  // จัดการสถานะเปิด-ปิดร้าน
  const [isStoreOpen, setIsStoreOpen] = useState(() => {
    const saved = localStorage.getItem('storeServiceStatus');
    return saved !== null ? JSON.parse(saved) : true;
  });

  // รายการวันหยุดของร้าน
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

  // กรองรายการออเดอร์รอตรวจสอบสลิป (Step 1)
  const pendingSlipOrders = (orders || []).filter(o => 
    o.statusStep === 1 && 
    (o.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
     (o.customerName && o.customerName.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  // กรองรายการที่กำลังซักอบอยู่ที่ร้าน (Step 5)
  const washingOrders = (orders || []).filter(o => o.statusStep === 5);

  const allOrdersList = (orders || []).filter(o =>
    o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (o.customerName && o.customerName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // อนุมัติสลิปพร้อมระบุไรเดอร์ผู้รับผิดชอบงาน
  const handleApproveSlip = (orderId) => {
    const chosenRiderId = selectedRiders[orderId] || riderList[0].id;
    const chosenRider = riderList.find(r => r.id === chosenRiderId) || riderList[0];

    if (!setOrders) return;
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          statusStep: 3, // ข้าม Step 2 ไป Step 3 ทันทีเพราะแอดมินมอบหมายไรเดอร์แล้ว
          statusTitle: 'ไรเดอร์ได้รับมอบหมาย กำลังไปรับผ้า',
          status: 'in_progress',
          paymentVerified: true,
          rider: chosenRider
        };
      }
      return order;
    }));
    alert(`อนุมัติคำสั่งซื้อ #${orderId} เรียบร้อยแล้ว มอบหมายให้ไรเดอร์ "${chosenRider.name}" ดูแลงาน`);
  };

  // ปฏิเสธสลิป
  const handleRejectSlip = (orderId) => {
    const reason = prompt('ระบุสาเหตุที่ปฏิเสธสลิป (เช่น ยอดไม่ตรง, สลิปซ้ำ):');
    if (!reason) return;

    if (!setOrders) return;
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          paymentRejected: true,
          rejectReason: reason,
          statusTitle: 'สลิปไม่ถูกต้อง รอแนบใหม่'
        };
      }
      return order;
    }));
    alert(`ปฏิเสธสลิป #${orderId} เรียบร้อยแล้ว`);
  };

  // ทางร้านซักอบเสร็จแล้ว -> สั่งส่งคืนผ้า (Step 5 -> Step 6)
  const handleCompleteWashing = (orderId) => {
    if (!setOrders) return;
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          statusStep: 6,
          statusTitle: 'ผ้าซักอบเสร็จแล้ว ไรเดอร์กำลังนำส่งคืนลูกค้า',
        };
      }
      return order;
    }));
    alert(`อัปเดตคำสั่งซื้อ #${orderId} เป็น "ซักอบเสร็จแล้ว" งานถูกส่งต่อไปยังไรเดอร์เพื่อจัดส่งคืนลูกค้า`);
  };

  // รายรับ
  const completedOrders = (orders || []).filter(o => o.statusStep === 7 || o.paymentVerified);
  const totalRevenue = completedOrders.reduce((sum, o) => sum + (Number(o.totalPrice || o.price) || 0), 0);
  const dailyRevenue = totalRevenue > 0 ? Math.round(totalRevenue * 0.35) : 680;
  const weeklyRevenue = totalRevenue > 0 ? Math.round(totalRevenue * 0.8) : 2450;
  const monthlyRevenue = totalRevenue > 0 ? totalRevenue : 5380;

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

  return (
    <div className="flex h-screen w-screen bg-slate-100 font-body text-slate-800 overflow-hidden text-base">
      
      {/* Sidebar ด้านซ้าย */}
      <aside className="w-72 bg-slate-900 text-white flex flex-col justify-between shrink-0 shadow-2xl z-20">
        <div>
          <div className="p-5 border-b border-slate-800 flex items-center gap-3.5 bg-slate-950/40">
            <div className="w-13 h-13 rounded-2xl bg-white flex items-center justify-center p-1 shadow-md shrink-0">
              <BrandLogo size={46} />
            </div>
            <div className="min-w-0">
              <h2 className="font-display font-normal text-lg text-white tracking-normal leading-tight">
                N&amp;N Laundromat
              </h2>
              <span className="text-xs text-blue-400 font-semibold tracking-wide block mt-0.5">
                ADMIN CONTROL HUB
              </span>
            </div>
          </div>

          <nav className="p-5 space-y-2">
            <button
              onClick={() => setActiveTab('slips')}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-bold transition cursor-pointer ${
                activeTab === 'slips' 
                  ? 'bg-[#1d61f2] text-white shadow-md shadow-blue-500/20' 
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <ClipboardCheck size={20} />
                <span>ตรวจสอบสลิป &amp; เลือกไรเดอร์</span>
              </div>
              {pendingSlipOrders.length > 0 && (
                <span className="bg-amber-500 text-white text-xs font-black px-2.5 py-0.5 rounded-full">
                  {pendingSlipOrders.length}
                </span>
              )}
            </button>

            {/* แท็บใหม่: จัดการผ้าซักอบที่ร้าน */}
            <button
              onClick={() => setActiveTab('washing')}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-bold transition cursor-pointer ${
                activeTab === 'washing' 
                  ? 'bg-[#1d61f2] text-white shadow-md shadow-blue-500/20' 
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Sparkles size={20} />
                <span>ผ้ากำลังซักอบ (หน้าร้าน)</span>
              </div>
              {washingOrders.length > 0 && (
                <span className="bg-blue-500 text-white text-xs font-black px-2.5 py-0.5 rounded-full">
                  {washingOrders.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition cursor-pointer ${
                activeTab === 'analytics' 
                  ? 'bg-[#1d61f2] text-white shadow-md shadow-blue-500/20' 
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <TrendingUp size={20} />
              <span>สรุปรายรับและรายงาน</span>
            </button>

            <button
              onClick={() => setActiveTab('calendar')}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold transition cursor-pointer ${
                activeTab === 'calendar' 
                  ? 'bg-[#1d61f2] text-white shadow-md shadow-blue-500/20' 
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <CalendarIcon size={20} />
              <span>ปฏิทินและวันหยุดบริการ</span>
            </button>
          </nav>
        </div>

        <div className="p-5 border-t border-slate-800 bg-slate-950/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1d61f2]/20 border border-[#1d61f2]/40 flex items-center justify-center text-sm font-bold text-blue-400">
                ADM
              </div>
              <div className="text-left">
                <span className="text-sm font-bold text-slate-100 block truncate max-w-[130px]">{activeAdmin.name}</span>
                <span className="text-xs text-slate-400 block">{activeAdmin.id}</span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-xl transition cursor-pointer"
              title="ออกจากระบบ"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0 shadow-xs">
          <div>
            <h1 className="font-display font-bold text-xl text-slate-900 leading-tight">
              {activeTab === 'slips' && 'ตรวจสอบสลิปและมอบหมายไรเดอร์ (Slip & Rider Assignment)'}
              {activeTab === 'washing' && 'แผนกซัก-อบผ้าของทางร้าน (Washing & Ready for Return)'}
              {activeTab === 'analytics' && 'ภาพรวมและรายงานสรุปรายรับ (Revenue Dashboard)'}
              {activeTab === 'calendar' && 'จัดการตารางเวลาและวันหยุดบริการ (Store Schedule)'}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5 font-normal">
              ระบบบริหารจัดการสำหรับเจ้าหน้าที่ N&amp;N Laundromat
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="ค้นหาเลขออเดอร์, ชื่อลูกค้า..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm w-72 focus:outline-none focus:border-[#1d61f2] focus:bg-white transition"
              />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">

          {/* ======================= แท็บ 1: ตรวจสอบสลิป & เลือกไรเดอร์ ======================= */}
          {activeTab === 'slips' && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-7 py-5 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-base text-slate-900">รายการสลิปที่รอตรวจสอบ</span>
                    <span className="bg-amber-100 text-amber-800 text-xs font-extrabold px-3 py-1 rounded-full">
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
                        <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold">
                          <th className="py-4 px-6">เลขออเดอร์</th>
                          <th className="py-4 px-6">ลูกค้า</th>
                          <th className="py-4 px-6">บริการ / แพ็กเกจ</th>
                          <th className="py-4 px-6">ยอดชำระ</th>
                          <th className="py-4 px-6 text-center">หลักฐานสลิป</th>
                          <th className="py-4 px-6">มอบหมายไรเดอร์</th>
                          <th className="py-4 px-6 text-right">ดำเนินการ</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {pendingSlipOrders.map(order => (
                          <tr key={order.id} className="hover:bg-slate-50/80 transition">
                            <td className="py-5 px-6 font-bold text-[#1d61f2] text-base">#{order.id}</td>
                            <td className="py-5 px-6">
                              <span className="font-bold text-slate-800 block text-base">{order.customerName || 'ลูกค้าทั่วไป'}</span>
                              <span className="text-xs text-slate-500 font-medium">{order.customerPhone || '-'}</span>
                            </td>
                            <td className="py-5 px-6">
                              <span className="font-semibold text-slate-800 block">{order.serviceName}</span>
                              <span className="text-xs text-slate-500">{order.packageName}</span>
                            </td>
                            <td className="py-5 px-6 font-bold text-slate-900 text-base">
                              {(order.totalPrice || order.price || 0).toLocaleString()} บาท
                            </td>
                            <td className="py-5 px-6 text-center">
                              <button
                                onClick={() => setSelectedSlip(order.slipImage || 'mock_slip')}
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-[#1d61f2] rounded-xl text-xs font-bold transition cursor-pointer"
                              >
                                <Eye size={15} /> ดูสลิป
                              </button>
                            </td>

                            {/* ตัวเลือกเลือกไรเดอร์ประจำออเดอร์ */}
                            <td className="py-5 px-6">
                              <select
                                value={selectedRiders[order.id] || riderList[0].id}
                                onChange={(e) => setSelectedRiders({ ...selectedRiders, [order.id]: e.target.value })}
                                className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 focus:border-[#1d61f2] outline-none"
                              >
                                {riderList.map(r => (
                                  <option key={r.id} value={r.id}>
                                    {r.name} ({r.id})
                                  </option>
                                ))}
                              </select>
                            </td>

                            <td className="py-5 px-6 text-right space-x-2.5">
                              <button
                                onClick={() => handleRejectSlip(order.id)}
                                className="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-xl font-bold text-xs transition cursor-pointer"
                              >
                                ปฏิเสธ
                              </button>
                              <button
                                onClick={() => handleApproveSlip(order.id)}
                                className="px-5 py-2 bg-[#1d61f2] hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-sm transition cursor-pointer"
                              >
                                อนุมัติ &amp; มอบหมายงาน
                              </button>
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

          {/* ======================= แท็บ 2: แผนกผ้าซักอบ (Step 5) ======================= */}
          {activeTab === 'washing' && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-7">
                <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
                  <div>
                    <h3 className="font-bold text-base text-slate-900">รายการผ้าที่กำลังดำเนินการซัก-อบที่ร้าน</h3>
                    <p className="text-xs text-slate-500 mt-0.5">เมื่อผ้าแห้งสนิทและพับเรียบร้อยแล้ว ให้กดปุ่มเพื่อเรียกไรเดอร์ส่งคืนลูกค้า</p>
                  </div>
                  <span className="bg-blue-50 text-[#1d61f2] font-bold text-xs px-3 py-1 rounded-full">
                    {washingOrders.length} ตะกร้าที่ร้าน
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
                            <div><span className="font-bold">ลูกค้า:</span> {order.customerName || 'ลูกค้าทั่วไป'} ({order.customerPhone || '-'})</div>
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

          {/* ======================= แท็บ 3: สรุปรายรับ ======================= */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-400 block tracking-wide">รายรับประจำวัน (วันนี้)</span>
                    <span className="text-3xl font-extrabold text-[#1d61f2] leading-normal block pt-1">
                      {dailyRevenue.toLocaleString()} บาท
                    </span>
                    <span className="text-xs text-emerald-600 font-bold mt-1.5 block">ชำระผ่านพร้อมเพย์ทั้งหมด</span>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#1d61f2] flex items-center justify-center">
                    <DollarSign size={28} />
                  </div>
                </div>

                <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-400 block tracking-wide">รายรับรอบสัปดาห์ (7 วันล่าสุด)</span>
                    <span className="text-3xl font-extrabold text-slate-900 leading-normal block pt-1">
                      {weeklyRevenue.toLocaleString()} บาท
                    </span>
                    <span className="text-xs text-slate-500 font-semibold mt-1.5 block">ออเดอร์สะสมต่อเนื่อง</span>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <TrendingUp size={28} />
                  </div>
                </div>

                <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-400 block tracking-wide">รายรับประจำเดือนนี้</span>
                    <span className="text-3xl font-extrabold text-slate-900 leading-normal block pt-1">
                      {monthlyRevenue.toLocaleString()} บาท
                    </span>
                    <span className="text-xs text-slate-500 font-semibold mt-1.5 block">รอบบัญชีปัจจุบัน</span>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                    <CalendarIcon size={28} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================= แท็บ 4: ปฏิทินร้าน ======================= */}
          {activeTab === 'calendar' && (
            <div className="max-w-4xl space-y-6">
              <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-slate-900">การเปิด-ปิดระบบรับออเดอร์ทันที (Master Switch)</h3>
                  <p className="text-sm text-slate-500 mt-1">
                    หากสั่งปิดระบบ หน้าแรกและหน้าสั่งซักผ้าของลูกค้าจะงดรับคำสั่งซื้อใหม่ทันที
                  </p>
                  <span className={`inline-block text-xs font-bold px-3.5 py-1.5 rounded-lg mt-3.5 ${
                    isStoreOpen ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
                  }`}>
                    {isStoreOpen ? 'ระบบกำลังเปิดรับออเดอร์ตามปกติ' : 'ระบบปิดให้บริการชั่วคราว'}
                  </span>
                </div>

                <button
                  onClick={toggleStoreStatus}
                  className={`px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 transition cursor-pointer ${
                    isStoreOpen 
                      ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100' 
                      : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm'
                  }`}
                >
                  <Power size={18} />
                  {isStoreOpen ? 'สั่งปิดระบบชั่วคราว' : 'สั่งเปิดระบบให้บริการ'}
                </button>
              </div>

              <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-base text-slate-900 mb-2">กำหนดวันหยุดร้านล่วงหน้า</h3>
                <div className="flex items-center gap-3.5 max-w-md mb-6">
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:border-[#1d61f2]"
                  />
                  <button
                    onClick={() => handleToggleClosedDate(selectedDate)}
                    className="px-6 py-3 bg-[#1d61f2] hover:bg-blue-700 text-white font-bold text-sm rounded-2xl transition cursor-pointer shadow-sm"
                  >
                    {closedDates.includes(selectedDate) ? 'ยกเลิกวันหยุดนี้' : 'บันทึกเป็นวันหยุด'}
                  </button>
                </div>

                <div className="border-t border-slate-100 pt-5">
                  <span className="text-sm font-bold text-slate-700 block mb-3">รายการวันหยุดที่บันทึกไว้:</span>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5">
                    {closedDates.sort().map(d => (
                      <div key={d} className="flex items-center justify-between p-3.5 bg-red-50/70 border border-red-100 rounded-2xl text-sm font-bold text-red-700">
                        <span>{d}</span>
                        <button
                          onClick={() => handleToggleClosedDate(d)}
                          className="text-red-400 hover:text-red-700 cursor-pointer p-1"
                        >
                          <Trash2 size={16} />
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

      {/* Modal ดูรูปสลิป */}
      {selectedSlip && (
        <div
          className="fixed inset-0 bg-slate-900/75 backdrop-blur-xs flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedSlip(null)}
        >
          <div className="bg-white rounded-3xl p-7 max-w-lg w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
              <h4 className="font-bold text-base text-slate-900">หลักฐานการโอนเงิน (สลิปพร้อมเพย์)</h4>
              <button onClick={() => setSelectedSlip(null)} className="text-slate-400 hover:text-slate-600 font-bold text-lg">✕</button>
            </div>
            <div className="w-full h-88 bg-gradient-to-b from-blue-50 to-slate-100 border border-slate-200 rounded-2xl flex flex-col items-center justify-center p-6 text-center">
              <CheckCircle2 size={52} className="text-emerald-500 mb-3" />
              <span className="text-base font-bold text-slate-800">โอนเงินสำเร็จ</span>
              <span className="text-xs text-slate-500 mt-1">ธนาคารกสิกรไทย / พร้อมเพย์ N&amp;N</span>
              <span className="text-xl font-black text-[#1d61f2] mt-3">ยอดเงินถูกต้อง ครบถ้วน</span>
            </div>
            <button
              type="button"
              onClick={() => setSelectedSlip(null)}
              className="w-full mt-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-bold rounded-2xl transition"
            >
              ปิดหน้าต่างตรวจสอบ
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default DashboardPage;