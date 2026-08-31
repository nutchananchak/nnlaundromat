import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shirt, Layers, UserCircle2 } from 'lucide-react';
import BottomNav from '../../components/layout/BottomNav';
import { ORDER_STATUS, ORDER_STEPS } from '../../constants/orderStatus';
import { useAuth } from '../../context/AuthContext';

const mockOrder = {
  id: '1024',
  status: ORDER_STATUS.WASHING,
  eta: 'วันนี้ 18:00 น.',
};

const SERVICES = [
  { key: 'wash_dry', label: 'ซักอบ', icon: Shirt },
  { key: 'wash_dry_fold', label: 'ซักอบพับ', icon: Layers, badge: 'ยอดฮิต' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const auth = useAuth() || {};
  const user = auth.user;
  
  const [selectedService, setSelectedService] = useState('wash_dry_fold');

  const steps = ORDER_STEPS || [];
  const activeStep = steps.findIndex((s) => s.status === mockOrder.status);
  const currentStep = steps[activeStep >= 0 ? activeStep : 0] || { label: 'กำลังดำเนินการ' };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      minHeight: '100dvh',
      backgroundColor: '#0f172a',
      margin: 0,
      padding: 0,
    }}>
      {/* Container มือถือ (Responsive Mobile Wrapper) */}
      <div style={{
        width: '100vw',
        maxWidth: '430px',
        height: '100vh',
        maxHeight: '100vh',
        backgroundColor: '#f8fafc',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflowY: 'auto',
        overflowX: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      }} className="pb-24 font-body">

        {/* Header โทนสีน้ำเงิน */}
        <div style={{
          background: 'linear-gradient(135deg, #1d61f2 0%, #1045b8 100%)',
          color: '#ffffff',
          boxShadow: '0 10px 25px rgba(29, 97, 242, 0.25)',
          flexShrink: 0
        }} className="rounded-b-3xl px-6 pt-8 pb-6">
          <p className="text-white/80 text-sm font-medium">สวัสดี, คุณ{user?.name || 'ลูกค้า'}</p>
          {/* ปรับฟอนต์ชื่อร้านให้ตรงกับหน้า Login */}
          <h1 className="font-display font-bold text-white text-2xl mt-0.5 tracking-tight font-sans">N&N Laundromat</h1>

          <div className="flex items-center gap-3 bg-white/15 rounded-2xl p-3 mt-5 backdrop-blur-sm border border-white/20">
            <div className="w-11 h-11 rounded-full bg-white/25 flex items-center justify-center shrink-0">
              <UserCircle2 className="text-white" size={26} />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-white text-sm truncate">
                {user?.name || 'USERNAME'}
              </p>
              <p className="text-white/70 text-xs truncate">
                {user?.address || 'ยังไม่ได้ระบุที่อยู่รับ-ส่งผ้า'}
              </p>
            </div>
          </div>
        </div>

        {/* Order tracking */}
        <div className="px-6 mt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-bold text-lg text-gray-900">ติดตามสถานะผ้า</h2>
            <span className="text-xs font-semibold text-[#1d61f2] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              ออเดอร์ #{mockOrder.id}
            </span>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <p className="font-display font-bold text-[#1d61f2] text-center text-base">
              {currentStep.label}
            </p>
            <p className="text-xs text-gray-500 text-center mt-1 font-medium">
              ขั้นตอนที่ {(activeStep >= 0 ? activeStep : 0) + 1} จาก {steps.length}
              {mockOrder.eta && ` • คาดว่าจะส่งคืน ${mockOrder.eta}`}
            </p>

            {/* Stepper แนวนอน พร้อมคำอธิบายใต้ไอคอน */}
            <div className="flex items-start justify-between mt-6 px-1">
              {steps.map((step, idx) => {
                const Icon = step.icon;
                const isDone = idx < activeStep;
                const isActive = idx === activeStep;
                return (
                  <div
                    key={step.status || idx}
                    className="flex flex-col items-center flex-1 text-center px-0.5"
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                        isDone || isActive
                          ? 'bg-[#1d61f2] text-white shadow-sm'
                          : 'bg-gray-100 text-gray-400'
                      } ${isActive ? 'ring-4 ring-blue-100' : ''}`}
                      title={step.label}
                    >
                      {Icon ? <Icon size={14} strokeWidth={2.4} /> : <span>{idx + 1}</span>}
                    </div>
                    {/* คำอธิบายใต้ไอคอน ปรับสีสเต็ปที่เสร็จแล้วให้เป็นน้ำเงินเข้มแทนสีเขียว */}
                    <span className={`text-[9px] mt-1.5 leading-tight ${
                      isActive ? 'text-[#1d61f2] font-bold' : isDone ? 'text-blue-900 font-semibold' : 'text-gray-400 font-medium'
                    }`}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Service selection */}
        <div className="px-6 mt-7">
          <h2 className="font-display font-bold text-lg text-gray-900 mb-3">เลือกบริการใหม่</h2>
          <div className="flex gap-3">
            {SERVICES.map((s) => {
              const Icon = s.icon;
              const active = selectedService === s.key;
              return (
                <button
                  key={s.key}
                  onClick={() => setSelectedService(s.key)}
                  className={`relative flex-1 flex flex-col items-center justify-center gap-2 py-6 rounded-2xl border transition ${
                    active
                      ? 'bg-blue-50/60 border-[#1d61f2] shadow-sm'
                      : 'bg-white border-gray-100 hover:border-blue-200'
                  }`}
                >
                  {s.badge && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                      {s.badge}
                    </span>
                  )}
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      active ? 'bg-[#1d61f2] text-white' : 'bg-blue-50 text-[#1d61f2]'
                    }`}
                  >
                    <Icon size={22} />
                  </div>
                  <span className={`text-sm font-semibold ${active ? 'text-[#1d61f2]' : 'text-gray-800'}`}>
                    {s.label}
                  </span>
                </button>
              );
            })}
          </div>
          <button
            onClick={() => navigate('/order/new', { state: { service: selectedService } })}
            className="w-full mt-4 py-3.5 rounded-xl bg-[#1d61f2] text-white font-display font-semibold tracking-wide shadow-md shadow-blue-500/20 active:scale-[0.98] transition"
          >
            จองบริการนี้
          </button>
        </div>

        <BottomNav />
      </div>
    </div>
  );
}