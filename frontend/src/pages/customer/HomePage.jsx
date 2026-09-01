import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  MapPin, 
  ChevronDown, 
  Layers, 
  BedDouble, 
  ShieldCheck, 
  Clock, 
  Bike, 
  Store, 
  Sparkles, 
  Truck, 
  CheckCircle2, 
  ChevronRight,
  Plus,
  Check,
  X
} from 'lucide-react';
import BottomNav from '../../components/layout/BottomNav';
import { useApp } from '../../context/AppContext';

export default function HomePage() {
  const navigate = useNavigate();
  const { userProfile, addresses, selectedAddressId, setSelectedAddressId, currentAddress, activeOrder } = useApp();
  
  const [showAddressPicker, setShowAddressPicker] = useState(false);
  const [selectedService, setSelectedService] = useState('wash_dry_fold');

  const steps = [
    { step: 1, label: 'ตรวจสอบยอด', icon: ShieldCheck },
    { step: 2, label: 'รอรับงาน', icon: Clock },
    { step: 3, label: 'กำลังมารับ', icon: Bike },
    { step: 4, label: 'นำส่งร้าน', icon: Store },
    { step: 5, label: 'กำลังซักอบ', icon: Sparkles },
    { step: 6, label: 'ส่งคืนผ้า', icon: Truck },
    { step: 7, label: 'สำเร็จ', icon: CheckCircle2 },
  ];

  const handleViewOrderStatus = () => {
    if (activeOrder) {
      navigate(`/orders/${activeOrder.id}`);
    }
  };

  const handleBookService = () => {
    navigate('/order/new', {
      state: {
        service: selectedService,
        address: currentAddress?.detail
      }
    });
  };

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
      <div style={{
        width: '100vw',
        maxWidth: '430px',
        height: '100vh',
        maxHeight: '100vh',
        backgroundColor: '#f8fafc',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflowX: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      }} className="font-body">

        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #1d61f2 0%, #1045b8 100%)',
          color: '#ffffff',
          boxShadow: '0 10px 25px rgba(29, 97, 242, 0.25)',
          flexShrink: 0
        }} className="rounded-b-3xl px-5 pt-6 pb-6 z-20 flex flex-col gap-3">
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-xs font-medium">สวัสดีคุณลูกค้า 👋</p>
              <h1 className="font-display font-bold text-white text-lg tracking-tight">N&N Laundromat</h1>
            </div>
            <span className="text-[10px] bg-white/20 text-white font-bold px-2.5 py-1 rounded-full border border-white/30 backdrop-blur-sm">
              เปิดบริการ 08:00 - 21:00 น.
            </span>
          </div>

          {/* สลับที่อยู่จากส่วนกลาง */}
          <div 
            onClick={() => setShowAddressPicker(true)}
            className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 flex items-center justify-between cursor-pointer hover:bg-white/20 transition active:scale-[0.99]"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-white/20 border border-white/40 flex items-center justify-center shrink-0">
                {userProfile.avatar ? (
                  <img src={userProfile.avatar} alt="Profile" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <User size={20} className="text-white" />
                )}
              </div>
              <div className="min-w-0">
                <h2 className="font-bold text-xs text-white truncate leading-tight">
                  {userProfile.name}
                </h2>
                <div className="flex items-center gap-1 mt-0.5 text-white/80">
                  <MapPin size={11} className="shrink-0 text-white" />
                  <span className="text-[11px] font-medium truncate max-w-[210px]">
                    {currentAddress ? `${currentAddress.title} - ${currentAddress.detail}` : 'ยังไม่ได้ระบุที่อยู่'}
                  </span>
                </div>
              </div>
            </div>

            <ChevronDown size={16} className="text-white/80 shrink-0 ml-2" />
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-5 py-5 pb-40 flex flex-col gap-5">

          {/* 1. ติดตามสถานะผ้า */}
          {activeOrder ? (
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <h2 className="font-bold text-base text-gray-900">ติดตามสถานะผ้า</h2>
                <span className="text-xs font-bold text-[#1d61f2] bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                  ออเดอร์ #{activeOrder.id}
                </span>
              </div>

              <div
                onClick={handleViewOrderStatus}
                className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm hover:border-blue-300 hover:shadow-md transition-all active:scale-[0.98] cursor-pointer flex flex-col gap-3 group"
              >
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <h3 className="font-extrabold text-base text-[#1d61f2] group-hover:underline">
                      {activeOrder.statusTitle}
                    </h3>
                    <ChevronRight size={16} className="text-[#1d61f2] group-hover:translate-x-0.5 transition" />
                  </div>
                  <p className="text-[11px] text-gray-500 mt-0.5 font-medium">
                    ขั้นตอนที่ {activeOrder.statusStep} จาก {steps.length} • {activeOrder.estimatedTime}
                  </p>
                </div>

                <div className="flex items-start justify-between relative mt-2 px-1">
                  <div className="absolute top-4 left-4 right-4 h-0.5 bg-gray-100 -z-0">
                    <div 
                      className="h-full bg-[#1d61f2] transition-all duration-500"
                      style={{ width: `${((activeOrder.statusStep - 1) / (steps.length - 1)) * 100}%` }}
                    ></div>
                  </div>

                  {steps.map((item) => {
                    const Icon = item.icon;
                    const isPassed = item.step <= activeOrder.statusStep;
                    const isCurrent = item.step === activeOrder.statusStep;

                    return (
                      <div key={item.step} className="flex flex-col items-center z-10 w-8 text-center">
                        <div 
                          className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                            isCurrent
                              ? 'bg-[#1d61f2] text-white ring-4 ring-blue-100 scale-110 shadow-sm'
                              : isPassed
                              ? 'bg-[#1d61f2] text-white'
                              : 'bg-white text-gray-300 border border-gray-200'
                          }`}
                        >
                          <Icon size={13} />
                        </div>
                        <span className={`text-[7.5px] mt-1 leading-tight font-medium ${
                          isCurrent ? 'text-[#1d61f2] font-bold' : isPassed ? 'text-gray-700' : 'text-gray-400'
                        }`}>
                          {item.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-4 rounded-3xl border border-gray-100 text-center py-6 shadow-sm">
              <Sparkles size={28} className="text-[#1d61f2] mx-auto mb-2" />
              <p className="text-xs font-bold text-gray-800">ไม่มีผ้าที่กำลังดำเนินการในขณะนี้</p>
              <p className="text-[11px] text-gray-400 mt-0.5">เลือกแพ็กเกจบริการด้านล่างเพื่อส่งซักได้เลย</p>
            </div>
          )}

          {/* 2. เลือกบริการใหม่ */}
          <div>
            <h2 className="font-bold text-base text-gray-900 mb-2.5">เลือกบริการใหม่</h2>
            
            <div className="grid grid-cols-2 gap-3">
              <div
                onClick={() => setSelectedService('wash_dry_fold')}
                className={`p-4 rounded-3xl border flex flex-col items-center justify-center text-center cursor-pointer transition relative ${
                  selectedService === 'wash_dry_fold'
                    ? 'bg-blue-50/60 border-[#1d61f2] shadow-sm ring-1 ring-[#1d61f2]'
                    : 'bg-white border-gray-100 hover:border-blue-200'
                }`}
              >
                <div className="absolute -top-2.5 right-3 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                  ยอดฮิต
                </div>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-2 ${
                  selectedService === 'wash_dry_fold' ? 'bg-[#1d61f2] text-white' : 'bg-blue-50 text-[#1d61f2]'
                }`}>
                  <Layers size={24} />
                </div>
                <span className="font-bold text-xs text-gray-900">ซัก อบ พับ</span>
                <span className="text-[10px] text-gray-500 mt-0.5">เริ่มต้น 160฿</span>
              </div>

              <div
                onClick={() => setSelectedService('bedding')}
                className={`p-4 rounded-3xl border flex flex-col items-center justify-center text-center cursor-pointer transition relative ${
                  selectedService === 'bedding'
                    ? 'bg-blue-50/60 border-[#1d61f2] shadow-sm ring-1 ring-[#1d61f2]'
                    : 'bg-white border-gray-100 hover:border-blue-200'
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-2 ${
                  selectedService === 'bedding' ? 'bg-[#1d61f2] text-white' : 'bg-blue-50 text-[#1d61f2]'
                }`}>
                  <BedDouble size={24} />
                </div>
                <span className="font-bold text-xs text-gray-900">ชุดเครื่องนอน/ผ้านวม</span>
                <span className="text-[10px] text-gray-500 mt-0.5">เริ่มต้น 200฿</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleBookService}
            className="w-full py-3.5 rounded-2xl bg-[#1d61f2] text-white font-bold text-sm shadow-md shadow-blue-500/25 active:scale-[0.98] transition cursor-pointer flex items-center justify-center gap-2 mt-1"
          >
            จองบริการนี้
          </button>

        </div>

        {/* Modal เลือกที่อยู่ */}
        {showAddressPicker && (
          <div className="absolute inset-0 bg-black/50 z-50 flex items-end justify-center backdrop-blur-sm">
            <div className="bg-white w-full max-w-[430px] rounded-t-3xl p-5 shadow-2xl flex flex-col gap-4 animate-in slide-in-from-bottom duration-200">
              
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-[#1d61f2]" />
                  <h3 className="font-bold text-sm text-gray-900">เลือกที่อยู่สำหรับรับ-ส่งผ้า</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddressPicker(false)}
                  className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"
                >
                  <X size={14} />
                </button>
              </div>

              <div className="flex flex-col gap-2.5">
                {addresses.map((addr) => {
                  const isSelected = selectedAddressId === addr.id;
                  return (
                    <div
                      key={addr.id}
                      onClick={() => {
                        setSelectedAddressId(addr.id);
                        setShowAddressPicker(false);
                      }}
                      className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
                        isSelected
                          ? 'bg-blue-50/70 border-[#1d61f2]'
                          : 'bg-white border-gray-100 hover:border-blue-100'
                      }`}
                    >
                      <div className="min-w-0 pr-3">
                        <span className="font-bold text-xs text-gray-900 block">{addr.title}</span>
                        <span className="text-[11px] text-gray-500 truncate block mt-0.5">{addr.detail}</span>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-[#1d61f2] text-white flex items-center justify-center shrink-0">
                          <Check size={12} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowAddressPicker(false);
                  navigate('/profile');
                }}
                className="w-full py-2.5 rounded-xl border border-dashed border-gray-300 text-gray-600 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-gray-50 transition"
              >
                <Plus size={14} /> จัดการ / เพิ่มหมุดที่อยู่ใหม่ในโปรไฟล์
              </button>
            </div>
          </div>
        )}

        <BottomNav />
      </div>
    </div>
  );
}