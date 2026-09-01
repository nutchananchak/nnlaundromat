import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Camera, FileText, CheckSquare, Square, ShoppingBag, X } from 'lucide-react';

export default function NewOrderPage() {
  const navigate = useNavigate();
  const location = useLocation() || {};
  const reorderData = location.state || {};

  // ป้องกัน auth เป็น undefined/null แล้วเด้งหลุด
  const serviceType = reorderData.service || location.state?.service || 'wash_dry_fold';

  const packages = serviceType === 'bedding' ? [
    { id: '3.5ft', name: 'ไซส์ 3.5 ฟุต', price: 200, desc: 'สำหรับที่นอนขนาด 3.5 ฟุต' },
    { id: '5ft', name: 'ไซส์ 5 ฟุต', price: 230, desc: 'สำหรับที่นอนขนาด 5 ฟุต' },
    { id: '6ft', name: 'ไซส์ 6 ฟุต', price: 250, desc: 'สำหรับที่นอนขนาด 6 ฟุต' },
  ] : [
    { id: 'S', name: 'ไซส์ S', price: 160, desc: 'ผ้าไม่เกิน 15 ชิ้น' },
    { id: 'M', name: 'ไซส์ M', price: 180, desc: 'ผ้าไม่เกิน 35 ชิ้น' },
    { id: 'L', name: 'ไซส์ L', price: 240, desc: 'ผ้าไม่เกิน 65 ชิ้น' },
  ];

  // หา ID แพ็กเกจเดิมที่ส่งมาจากหน้าใบเสร็จ
  const initialPkgId = serviceType === 'bedding'
    ? (reorderData.packageSize?.includes('3.5') ? '3.5ft' : reorderData.packageSize?.includes('5') ? '5ft' : reorderData.packageSize?.includes('6') ? '6ft' : '')
    : (reorderData.packageSize?.includes('S') ? 'S' : reorderData.packageSize?.includes('M') ? 'M' : reorderData.packageSize?.includes('L') ? 'L' : '');

  const [selectedPackage, setSelectedPackage] = useState(initialPkgId);
  const [pickupTime, setSelectedPickupTime] = useState('08:00 - 09:00 น.');
  const [basketImage, setBasketImage] = useState(null);
  const [note, setNote] = useState(reorderData.note || '');
  const [agreed, setAgreed] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const timeSlots = [
    '08:00 - 09:00 น.',
    '10:00 - 11:00 น.',
    '12:00 - 13:00 น.',
    '14:00 - 15:00 น.',
    '16:00 - 17:00 น.',
    '18:00 - 19:00 น.',
    '20:00 - 21:00 น.',
  ];

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setBasketImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const currentPkg = packages.find(p => p.id === selectedPackage);
  const totalPrice = currentPkg ? currentPkg.price : 0;

  const handleCreateOrder = (e) => {
    e.preventDefault();
    if (!selectedPackage) {
      alert('กรุณาเลือกแพ็กเกจที่ต้องการใช้งาน');
      return;
    }
    if (!agreed) {
      alert('กรุณากดยอมรับเงื่อนไขการใช้บริการ');
      return;
    }

    navigate('/order/payment', {
      state: {
        order: {
          id: 'NN-' + Math.floor(100000 + Math.random() * 900000),
          serviceName: serviceType === 'bedding' ? 'ชุดเครื่องนอน / ผ้านวม' : 'ซัก อบ พับ',
          packageName: currentPkg?.name,
          pickupTime: pickupTime,
          address: reorderData.address || 'หอพักใจดี ห้อง 204 (ซอยพหลโยธิน 34)',
          basketImage: basketImage,
          note: note,
          totalPrice: totalPrice,
        }
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
        }} className="rounded-b-3xl px-6 pt-6 pb-6 flex items-center gap-3 z-20">
          <button 
            type="button"
            onClick={() => navigate('/home')}
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition cursor-pointer"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <p className="text-white/80 text-xs font-medium">N&N Laundromat</p>
            <h1 className="font-display font-medium text-white text-xl tracking-tight">
              {serviceType === 'bedding' ? 'ชุดเครื่องนอน / ผ้านวม' : 'ซัก อบ พับ'}
            </h1>
          </div>
        </div>

        {/* ส่วนเนื้อหา Scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-6 pb-32 flex flex-col gap-6">
          
          {/* 1. สถานที่รับ-ส่งผ้า */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">สถานที่รับ-ส่งผ้า</label>
            <div className="bg-white p-4 rounded-2xl border border-gray-100 flex items-start gap-3 shadow-sm">
              <MapPin className="text-[#1d61f2] shrink-0 mt-0.5" size={20} />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400 font-medium">ที่อยู่จัดส่ง</p>
                <p className="text-sm font-semibold text-gray-800 truncate mt-0.5">
                  {reorderData.address || 'หอพักใจดี ห้อง 204 (ซอยพหลโยธิน 34)'}
                </p>
              </div>
              <button 
                type="button" 
                onClick={() => navigate('/profile')}
                className="text-xs text-[#1d61f2] font-semibold self-center shrink-0 hover:underline cursor-pointer"
              >
                เปลี่ยน
              </button>
            </div>
          </div>

          {/* 2. เลือกแพ็กเกจ */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              เลือกแพ็กเกจ{serviceType === 'bedding' ? 'ชุดเครื่องนอน' : 'ซัก อบ พับ'}
            </label>
            <div className="flex flex-col gap-3">
              {packages.map((pkg) => {
                const isSelected = selectedPackage === pkg.id;
                return (
                  <div
                    key={pkg.id}
                    onClick={() => setSelectedPackage(pkg.id)}
                    className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
                      isSelected
                        ? 'bg-blue-50/60 border-[#1d61f2] shadow-sm'
                        : 'bg-white border-gray-100 hover:border-blue-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`font-display font-medium text-base ${isSelected ? 'text-[#1d61f2]' : 'text-gray-900'}`}>
                          {pkg.name}
                        </span>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md font-medium">
                          {pkg.desc}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 font-medium">ราคาบริการ</p>
                    </div>
                    <div className="text-right">
                      <span className={`font-display font-medium text-lg ${isSelected ? 'text-[#1d61f2]' : 'text-gray-900'}`}>
                        {pkg.price}฿
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. รอบเวลารับผ้า */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">รอบเวลารับผ้า</label>
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 mb-3 text-gray-700">
                <Clock size={18} className="text-[#1d61f2]" />
                <span className="text-xs font-semibold">เลือกรอบเวลาเข้ารับผ้า</span>
              </div>
              <select
                value={pickupTime}
                onChange={(e) => setSelectedPickupTime(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 p-3 rounded-xl text-sm font-semibold text-gray-800 outline-none cursor-pointer focus:border-[#1d61f2]"
              >
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </div>
          </div>

          {/* 4. ถ่ายรูปตะกร้าผ้า */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-1">ถ่ายรูปตะกร้าผ้า</label>
            <p className="text-xs text-gray-500 mb-2">ถ่ายรูปจุดที่วางตะกร้าเพื่อให้ไรเดอร์เข้ารับได้ถูกจุด</p>
            
            <label className="border-2 border-dashed border-gray-200 rounded-2xl p-5 flex flex-col items-center justify-center bg-white cursor-pointer hover:border-[#1d61f2] transition group">
              {basketImage ? (
                <div className="relative w-full h-40">
                  <img src={basketImage} alt="Basket" className="w-full h-full object-cover rounded-xl" />
                  <span className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-lg">เปลี่ยนรูป</span>
                </div>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-full bg-blue-50 text-[#1d61f2] flex items-center justify-center mb-2 group-hover:scale-105 transition">
                    <Camera size={24} />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">แตะเพื่อถ่ายรูปหรืออัปโหลดรูปภาพ</span>
                  <span className="text-xs text-gray-400 mt-1">รองรับไฟล์ JPG, PNG</span>
                </>
              )}
              <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </label>
          </div>

          {/* 5. หมายเหตุ */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">หมายเหตุถึงพนักงาน (ถ้ามี)</label>
            <div className="bg-white p-3 rounded-2xl border border-gray-100 flex items-start gap-3 shadow-sm">
              <FileText className="text-gray-400 shrink-0 mt-1" size={18} />
              <textarea
                rows="2"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="เช่น เสื้อหนัง, ผ้าสีตก..."
                className="w-full bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none resize-none"
              ></textarea>
            </div>
          </div>

          {/* 6. ยอมรับเงื่อนไขการใช้บริการ */}
          <div className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div onClick={() => setAgreed(!agreed)} className="cursor-pointer shrink-0">
              {agreed ? (
                <CheckSquare className="text-[#1d61f2]" size={22} />
              ) : (
                <Square className="text-gray-300" size={22} />
              )}
            </div>
            <span className="text-xs text-gray-700 font-medium leading-relaxed flex-1">
              ข้าพเจ้าได้ตรวจสอบข้อมูลและ{' '}
              <button 
                type="button" 
                onClick={(e) => { e.stopPropagation(); setShowTermsModal(true); }}
                className="text-[#1d61f2] font-bold underline cursor-pointer bg-transparent border-none p-0 inline"
              >
                ยอมรับเงื่อนไขการใช้บริการ
              </button>{' '}
              ของทางร้าน
            </span>
          </div>

        </div>

        {/* ส่วนสรุปราคาและปุ่มยืนยัน */}
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3.5 shadow-[0_-6px_20px_rgba(0,0,0,0.08)] flex flex-col gap-2.5 z-30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-600">
              <ShoppingBag size={16} className="text-[#1d61f2]" />
              <span className="text-xs font-semibold">ยอดรวมทั้งสิ้น</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-display font-bold text-xl text-[#1d61f2]">{totalPrice}</span>
              <span className="text-xs font-bold text-gray-500">บาท</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCreateOrder}
            className="w-full py-3 rounded-xl bg-[#1d61f2] text-white font-display font-bold text-sm tracking-wide shadow-md shadow-blue-500/20 active:scale-[0.98] transition cursor-pointer"
          >
            ยืนยันการสั่งบริการ
          </button>
        </div>

        {/* Modal แสดงเงื่อนไข */}
        {showTermsModal && (
          <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center p-6 backdrop-blur-sm">
            <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl flex flex-col max-h-[80vh]">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h3 className="font-display font-bold text-lg text-gray-900">เงื่อนไขการใช้บริการ</h3>
                <button 
                  type="button"
                  onClick={() => setShowTermsModal(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-4 text-xs text-gray-600 leading-relaxed flex flex-col gap-3 font-body">
                <p>1. ทางร้าน N&N Laundromat จะให้บริการรับ-ส่งผ้าตามรอบเวลาที่ลูกค้าได้เลือกไว้</p>
                <p>2. ลูกค้าโปรดตรวจสอบสิ่งของมีค่าหรือเงินที่ติดมากับกระเป๋าเสื้อผ้า ทางร้านจะไม่รับผิดชอบต่อความเสียหายหากมิได้แจ้งล่วงหน้า</p>
                <p>3. กรณีผ้าสีตกหรือชำรุดเนื่องจากสภาพเนื้อผ้า ทางร้านขอสงวนสิทธิ์ในการรับผิดชอบความเสียหายที่เกิดขึ้นจากตัวเนื้อผ้าเอง</p>
                <p>4. การชำระเงินสามารถทำได้ผ่านช่องทางที่ทางร้านกำหนดหลังจากคำสั่งซื้อได้รับการยืนยัน</p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setAgreed(true);
                  setShowTermsModal(false);
                }}
                className="w-full py-3 mt-2 rounded-xl bg-[#1d61f2] text-white font-display font-bold text-sm tracking-wide shadow-md shadow-blue-500/20 active:scale-[0.98] transition cursor-pointer"
              >
                เข้าใจและยอมรับเงื่อนไข
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}