import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Repeat, 
  AlertCircle, 
  Sparkles, 
  Bike, 
  Phone, 
  UserCheck, 
  Camera 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

// โลโก้ทางการ N&N LAUNDROMAT DELIVERY ตามแบบจริงเป๊ะๆ
const OfficialNnLogo = () => (
  <svg
    viewBox="0 0 200 200"
    width="88"
    height="88"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* วงกลมพื้นหลังสีฟ้าอ่อน */}
    <circle cx="100" cy="100" r="100" fill="#e8f3ff" />

    {/* ตัวรถสีน้ำเงินเข้ม (Navy) */}
    {/* ตัวตู้ซักผ้าด้านหลัง */}
    <path 
      d="M37 58C37 53.6 40.6 50 45 50H112C116.4 50 120 53.6 120 58V103H37V58Z" 
      fill="#0c4a7e" 
    />
    
    {/* หน้ารถคนขับ */}
    <path 
      d="M120 66.5H138C140.8 66.5 143.4 67.9 144.9 70.2L153 82.5C154.3 84.5 155 86.8 155 89.2V103H120V66.5Z" 
      fill="#0c4a7e" 
    />

    {/* กระจกหน้ารถสีขาว */}
    <path 
      d="M125 72.5H136.5C138.2 72.5 139.7 73.4 140.6 74.8L146.4 84C147.1 85.1 147.5 86.4 147.5 87.7V89.5H125V72.5Z" 
      fill="#ffffff" 
    />

    {/* ช่องใส่ผงซักฟอกและปุ่มกดบนตัวเครื่อง */}
    <rect x="45" y="56" width="13" height="6" rx="2" fill="#ffffff" />
    <circle cx="97.5" cy="59" r="2.8" fill="#ffffff" />
    <circle cx="109" cy="59" r="2.8" fill="#ffffff" />

    {/* ฝาถังซักผ้าสีขาว */}
    <circle cx="92" cy="85" r="18" fill="#ffffff" />
    {/* ขอบด้านใน */}
    <circle cx="92" cy="85" r="14.5" fill="#0c4a7e" />
    {/* น้ำและฟองอากาศในถัง */}
    <path 
      d="M77.5 85C77.5 80 81.5 76.5 86 79C90.5 81.5 94.5 88 100 85C104.5 82.5 106.5 85 106.5 85C106.5 93 100 99.5 92 99.5C84 99.5 77.5 93 77.5 85Z" 
      fill="#ffffff" 
    />
    <circle cx="94.5" cy="78" r="1.8" fill="#ffffff" />
    <circle cx="101" cy="82" r="1.3" fill="#ffffff" />

    {/* ล้อรถด้านซ้าย */}
    <circle cx="56" cy="113.5" r="11.5" fill="#0c4a7e" />
    <circle cx="56" cy="113.5" r="7.5" fill="#ffffff" />
    <circle cx="56" cy="113.5" r="4.2" fill="#0c4a7e" />

    {/* ล้อรถด้านขวา */}
    <circle cx="130" cy="113.5" r="11.5" fill="#0c4a7e" />
    <circle cx="130" cy="113.5" r="7.5" fill="#ffffff" />
    <circle cx="130" cy="113.5" r="4.2" fill="#0c4a7e" />

    {/* ข้อความ N&N LAUNDROMAT */}
    <text 
      x="100" 
      y="140" 
      fill="#0c4a7e" 
      fontSize="12.5" 
      fontWeight="900" 
      fontFamily="system-ui, -apple-system, sans-serif" 
      textAnchor="middle" 
      letterSpacing="1"
    >
      N&amp;N LAUNDROMAT
    </text>

    {/* ข้อความ DELIVERY */}
    <text 
      x="100" 
      y="153" 
      fill="#0c4a7e" 
      fontSize="7.5" 
      fontWeight="800" 
      fontFamily="system-ui, -apple-system, sans-serif" 
      textAnchor="middle" 
      letterSpacing="3"
    >
      DELIVERY
    </text>
  </svg>
);

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { orders } = useApp ? useApp() : {};

  const matchedOrder = (orders || []).find((o) => String(o.id) === String(id));

  const order = matchedOrder || {
    id: id || 'NN-XXXXXX',
    status: 'in_progress',
    statusStep: 1,
    statusTitle: 'กำลังดำเนินการ',
    serviceName: 'ซัก อบ พับ',
    packageName: 'ตะกร้า M',
    basePrice: 180,
    totalPrice: 180,
    createdAt: '-',
    deliveredAt: null,
    pickupTime: '-',
    deliveryTime: '-',
    address: '-',
    paymentStatus: 'ชำระเงินแล้ว',
    specialItems: [],
    plasticBagCount: 0,
    plasticBagPrice: 0,
    rider: {
      name: 'กำลังจัดสรรไรเดอร์',
      phone: '-',
      vehicle: '-'
    }
  };

  const riderInfo = order.rider || {
    name: 'กำลังจัดสรรไรเดอร์',
    phone: '-',
    vehicle: '-'
  };

  const isCompleted = 
    order.status === 'completed' || 
    Number(order.statusStep) >= 7 || 
    order.isCompleted === true ||
    order.statusTitle?.includes('สำเร็จ');

  const currentStep = Number(order.statusStep) || (isCompleted ? 7 : 1);

  const displayCreatedAt = order.createdAt || '-';
  const displayDeliveredAt = order.deliveredAt ? order.deliveredAt : (isCompleted ? 'ส่งมอบแล้ว' : '-');

  const packagePrice = Number(order.basePrice || (
    order.packageName?.includes('3.5') ? 200 :
    order.packageName?.includes('5') ? 230 :
    order.packageName?.includes('6') ? 250 :
    order.packageName?.includes('S') ? 160 :
    order.packageName?.includes('M') ? 180 :
    order.packageName?.includes('L') ? 240 :
    (order.packageName && !order.packageName.includes('เฉพาะ') ? (order.price || 0) : 0)
  ));

  const steps = useMemo(() => {
    return [
      { 
        step: 1, 
        title: 'ตรวจสอบยอดเงิน', 
        desc: 'ระบบยืนยันสลิปการโอนเงินเรียบร้อย', 
        time: displayCreatedAt 
      },
      { 
        step: 2, 
        title: 'จัดสรรไรเดอร์', 
        desc: `มอบหมายงานให้คุณ ${riderInfo.name}`, 
        time: currentStep >= 2 ? 'ดำเนินการแล้ว' : 'รอดำเนินการ' 
      },
      { 
        step: 3, 
        title: 'กำลังมารับผ้า', 
        desc: 'ไรเดอร์กำลังเดินทางไปยังที่อยู่ของคุณ', 
        time: currentStep >= 3 ? (order.pickupTime || 'กำลังเดินทาง') : 'ตามรอบเวลา' 
      },
      { 
        step: 4, 
        title: 'รับผ้าแล้วนำส่งร้าน', 
        desc: 'ผ้าถึงร้าน N&N Laundromat แผนกซักอบ', 
        time: currentStep >= 4 ? 'ถึงร้านแล้ว' : 'รอส่งมอบ' 
      },
      { 
        step: 5, 
        title: 'กำลังซักอบ', 
        desc: 'แยกผ้าและซักอบด้วยเครื่องมาตรฐาน สะอาด ปลอดภัย', 
        time: currentStep >= 5 ? 'กำลังดำเนินการ' : 'รอเริ่มซัก' 
      },
      { 
        step: 6, 
        title: 'อยู่ระหว่างส่งคืนผ้า', 
        desc: 'ไรเดอร์นำผ้าพับเรียบร้อยไปส่งคืนลูกค้า', 
        time: currentStep >= 6 ? 'กำลังนำส่ง' : (order.deliveryTime || '-') 
      },
      { 
        step: 7, 
        title: 'ส่งคืนผ้าสำเร็จ', 
        desc: 'ไรเดอร์ได้ส่งมอบผ้าสะอาดเรียบร้อยแล้ว', 
        time: order.deliveredAt ? order.deliveredAt : (isCompleted ? 'ส่งมอบแล้ว' : 'รอส่งมอบ') 
      },
    ];
  }, [currentStep, order, displayCreatedAt, riderInfo.name, isCompleted]);

  const handleReorder = () => {
    navigate('/order/new', {
      state: {
        service: order.serviceName?.includes('เครื่องนอน') ? 'bedding' : 'wash_dry_fold',
        packageSize: order.packageName,
        address: order.address,
        note: order.note
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
      }} className="font-body text-base">

        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #1d61f2 0%, #1045b8 100%)',
          color: '#ffffff',
          boxShadow: '0 10px 25px rgba(29, 97, 242, 0.25)',
          flexShrink: 0
        }} className="rounded-b-3xl px-6 pt-6 pb-6 flex items-center gap-3 z-20">
          <button 
            type="button"
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition cursor-pointer shrink-0"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="font-bold text-white text-lg tracking-tight">#{order.id}</h1>
            <p className="text-white/80 text-xs font-medium">
              {isCompleted ? 'ใบเสร็จรับเงิน' : 'ติดตามสถานะออเดอร์'}
            </p>
          </div>
        </div>

        {/* ================= แบบที่ 1: กำลังดำเนินการ ================= */}
        {!isCompleted ? (
          <div className="flex-1 overflow-y-auto px-5 py-5 pb-28 flex flex-col gap-4">
            
            {/* การ์ดสถานะปัจจุบัน */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 font-medium block">สถานะปัจจุบัน</span>
                <h2 className="font-bold text-lg text-[#1d61f2] mt-0.5">{order.statusTitle || 'กำลังดำเนินการ'}</h2>
                <p className="text-xs text-slate-600 mt-1 flex items-center gap-1">
                  <Clock size={12} className="text-slate-500" />
                  <span>รอบจัดส่งคืน: <b className="text-slate-800">{order.deliveryTime || 'ภายในวันนี้'}</b></span>
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-50 text-[#1d61f2] rounded-2xl flex items-center justify-center">
                <Sparkles size={24} />
              </div>
            </div>

            {/* ภาพถ่ายยืนยันจากไรเดอร์ */}
            {order.riderBasketImage ? (
              <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                    <Camera size={16} className="text-[#1d61f2]" />
                    <span>รูปถ่ายจุดรับผ้า / ตะกร้าผ้า</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    ไรเดอร์ถ่ายยืนยันแล้ว
                  </span>
                </div>
                <div className="w-full aspect-video rounded-2xl overflow-hidden bg-slate-900/5 border border-slate-100 flex items-center justify-center">
                  <img 
                    src={order.riderBasketImage} 
                    alt="Rider Basket Verification" 
                    className="w-full h-full object-contain" 
                  />
                </div>
                <span className="text-[11px] text-slate-400 font-medium text-center">
                  ภาพถ่ายยืนยันจุดรับผ้าโดยไรเดอร์ ({riderInfo.name})
                </span>
              </div>
            ) : (
              currentStep < 4 && (
                <div className="p-3 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-center">
                  <span className="text-[11.5px] text-slate-400 font-medium block">
                    เมื่อไรเดอร์ถึงจุดรับผ้า จะถ่ายภาพตะกร้าผ้าเพื่อยืนยันให้ท่านตรวจสอบที่นี่
                  </span>
                </div>
              )
            )}

            {/* ผู้ดูแลการจัดส่ง */}
            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#1d61f2] flex items-center justify-center shrink-0">
                  <Bike size={20} />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">ผู้ดูแลการจัดส่ง (ไรเดอร์)</span>
                  <span className="text-xs font-bold text-slate-800 block">{riderInfo.name}</span>
                  <span className="text-[10px] text-slate-500">{riderInfo.vehicle}</span>
                </div>
              </div>
              {riderInfo.phone && riderInfo.phone !== '-' && (
                <a
                  href={`tel:${riderInfo.phone}`}
                  className="w-9 h-9 rounded-full bg-blue-50 text-[#1d61f2] flex items-center justify-center hover:bg-blue-100 transition shadow-2xs"
                  title="โทรหาไรเดอร์"
                >
                  <Phone size={15} />
                </a>
              )}
            </div>

            {/* ไทม์ไลน์สถานะผ้า */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col gap-3">
              <h3 className="font-bold text-xs text-slate-900">ไทม์ไลน์ขั้นตอนการให้บริการ</h3>

              <div className="flex flex-col gap-4 relative pl-3 border-l-2 border-slate-100 ml-2 mt-1">
                {steps.map((s, idx) => {
                  const isCurrent = s.step === currentStep;
                  const isDone = s.step <= currentStep;

                  return (
                    <div key={idx} className="relative flex flex-col">
                      <div className={`absolute -left-[19px] top-0.5 w-3 h-3 rounded-full ${
                        isCurrent
                          ? 'bg-[#1d61f2] ring-4 ring-blue-100'
                          : isDone
                          ? 'bg-[#1d61f2]'
                          : 'bg-slate-200'
                      }`}></div>

                      <div className="flex items-center justify-between">
                        <span className={`text-xs ${
                          isCurrent ? 'font-bold text-[#1d61f2]' : isDone ? 'font-bold text-slate-800' : 'text-slate-400'
                        }`}>
                          {s.title}
                        </span>
                        <span className="text-[10px] font-medium text-slate-600">{s.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-snug mt-0.5">{s.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ข้อมูลคำสั่งซื้อและสถานที่ */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col gap-3 text-xs">
              <span className="font-bold text-slate-900">ข้อมูลคำสั่งซื้อ</span>
              
              <div className="flex justify-between text-slate-600 pb-2 border-b border-slate-100">
                <span>สร้างคำสั่งซื้อเมื่อ</span>
                <span className="font-bold text-slate-900">{displayCreatedAt}</span>
              </div>

              <div className="flex justify-between text-slate-600 pb-2 border-b border-slate-100">
                <span>บริการ</span>
                <span className="font-bold text-slate-900">{order.serviceName} ({order.packageName})</span>
              </div>
              
              <div className="flex justify-between text-slate-600 pb-2 border-b border-slate-100">
                <span>รอบเวลารับผ้า</span>
                <span className="font-bold text-slate-900">{order.pickupTime}</span>
              </div>

              <div className="flex items-start gap-2 text-slate-600 pt-1">
                <MapPin size={15} className="text-[#1d61f2] shrink-0 mt-0.5" />
                <span className="text-slate-800">{order.address}</span>
              </div>

              {order.note && (
                <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-[11px] text-slate-700">
                  <span className="font-bold text-slate-900">หมายเหตุ: </span>{order.note}
                </div>
              )}
            </div>

            {/* ปุ่มแจ้งปัญหาเป็นสีแดง */}
            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="w-full py-3 rounded-2xl bg-red-50/40 border border-red-200 text-red-600 font-bold text-xs hover:bg-red-50 transition cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <AlertCircle size={14} className="text-red-500" /> แจ้งปัญหาเกี่ยวกับออเดอร์นี้
            </button>

          </div>
        ) : (
          /* ================= แบบที่ 2: ใบเสร็จรับเงิน ================= */
          <div className="flex-1 overflow-y-auto px-5 py-5 pb-28 flex flex-col gap-4">
            
            <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200 flex flex-col gap-4 relative">
              
              {/* หัวใบเสร็จพร้อมโลโก้ N&N LAUNDROMAT DELIVERY ตามรูปจริง */}
              <div className="flex flex-col items-center text-center pb-4 border-b border-dashed border-slate-200">
                <div className="mb-2">
                  <OfficialNnLogo />
                </div>
                <p className="text-[11.5px] text-slate-400 mt-1">บริการรับ-ส่ง ซัก อบ พับ ถึงหน้าห้องพักคุณ</p>
                
                <div className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                  <CheckCircle2 size={13} className="text-emerald-600" /> จัดส่งผ้าคืนสำเร็จ
                </div>
              </div>

              {/* ข้อมูลเวลา */}
              <div className="flex flex-col gap-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">หมายเลขออเดอร์</span>
                  <span className="font-bold text-slate-900">#{order.id}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">วันเวลาที่สั่งซื้อ</span>
                  <span className="font-bold text-slate-900">{displayCreatedAt}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">เวลาส่งมอบผ้าสำเร็จ</span>
                  <span className="font-bold text-slate-900">{displayDeliveredAt}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">วิธีการชำระเงิน</span>
                  <span className="font-bold text-slate-900">{order.paymentMethod || 'พร้อมเพย์ (สแกน QR Code)'}</span>
                </div>
              </div>

              <div className="h-[1px] bg-slate-100"></div>

              {/* สรุปรายการค่าบริการ */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-slate-900">สรุปรายการค่าบริการ</span>
                
                <div className="bg-slate-50 p-3.5 rounded-2xl flex flex-col gap-2.5 border border-slate-100">
                  
                  {/* แถวที่ 1: แพ็กเกจหลัก */}
                  {order.packageName && !order.packageName.includes('เฉพาะรายการพิเศษ') && (
                    <div className="flex justify-between items-start text-xs">
                      <div className="pr-2">
                        <span className="font-bold text-slate-900 block">{order.serviceName}</span>
                        <span className="text-[11px] text-slate-500">{order.packageName}</span>
                      </div>
                      <span className="font-bold text-slate-900 shrink-0">{packagePrice.toLocaleString()} ฿</span>
                    </div>
                  )}

                  {/* แถวที่ 2: รายการพิเศษ */}
                  {order.specialItems && order.specialItems.length > 0 && (
                    <div className="pt-2 border-t border-slate-200/60 flex flex-col gap-1.5">
                      <span className="text-[11px] font-bold text-slate-700">รายการพิเศษ (แยกชิ้น):</span>
                      {order.specialItems.map((item) => (
                        <div key={item.id} className="flex justify-between text-xs text-slate-600">
                          <span>• {item.name} x {item.count} {item.unit || 'ชิ้น'}</span>
                          <span className="font-semibold text-slate-900">{Number(item.total || (item.price * item.count)).toLocaleString()} ฿</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* แถวที่ 3: ถุงพลาสติกเสริม */}
                  {order.plasticBagCount > 0 && (
                    <div className="flex justify-between items-center text-xs text-slate-600 pt-2 border-t border-slate-200/60">
                      <span>• ถุงพลาสติกใส่ผ้า x {order.plasticBagCount} ใบ</span>
                      <span className="font-semibold text-slate-900">{order.plasticBagCount * 5} ฿</span>
                    </div>
                  )}
                  
                  {/* แถวที่ 4: ค่าจัดส่งเป็นสีดำ */}
                  <div className="flex justify-between items-center text-xs text-slate-500 pt-2 border-t border-slate-200/60">
                    <span>ค่าบริการจัดส่ง Delivery</span>
                    <span className="font-bold text-slate-900">ฟรี</span>
                  </div>
                </div>
              </div>

              {/* ยอดชำระสุทธิ: ฟอนต์ขนาดพอดีตา */}
              <div className="flex justify-between items-center pt-2 border-t border-dashed border-slate-200">
                <span className="font-bold text-xs text-slate-700">ยอดชำระสุทธิ</span>
                <span className="font-bold text-base text-slate-900">{Number(order.totalPrice || order.price || 0).toLocaleString()} บาท</span>
              </div>

              <div className="h-[1px] bg-slate-100"></div>

              {/* ข้อมูลผู้ดูแลการจัดส่ง */}
              <div className="flex flex-col gap-2 text-xs">
                <span className="font-bold text-slate-900">ผู้ดูแลการจัดส่ง</span>
                <div className="bg-slate-50 p-3 rounded-2xl flex items-center justify-between border border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center">
                      <UserCheck size={16} />
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 block">{riderInfo.name}</span>
                      <span className="text-[10px] text-slate-500">{riderInfo.vehicle}</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-slate-800">{riderInfo.phone}</span>
                </div>
              </div>

              <div className="h-[1px] bg-slate-100"></div>

              {/* กำหนดการรับ-ส่งและที่อยู่ */}
              <div className="flex flex-col gap-2 text-xs">
                <span className="font-bold text-slate-900">กำหนดการรับ-ส่ง</span>
                
                <div className="flex items-start gap-2.5 text-slate-600">
                  <Clock size={15} className="text-slate-700 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="text-slate-700 block">
                      รอบเวลารับผ้า: <b className="text-slate-900">{order.pickupTime || '-'}</b>
                    </span>
                    <span className="text-slate-700 block">
                      เวลาส่งมอบสำเร็จ: <b className="text-slate-900">{displayDeliveredAt}</b>
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 text-slate-600 mt-1">
                  <MapPin size={15} className="text-slate-700 shrink-0 mt-0.5" />
                  <span className="text-slate-800">{order.address}</span>
                </div>
              </div>

            </div>

            {/* ปุ่มสั่งบริการนี้อีกครั้ง */}
            <button
              type="button"
              onClick={handleReorder}
              className="w-full py-3.5 rounded-2xl bg-[#1d61f2] hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 active:scale-[0.98] transition cursor-pointer flex items-center justify-center gap-2"
            >
              <Repeat size={15} /> สั่งบริการนี้อีกครั้ง
            </button>

            {/* ปุ่มแจ้งปัญหาเป็นสีแดง */}
            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="w-full py-3 rounded-2xl bg-red-50/40 border border-red-200 text-red-600 font-bold text-xs hover:bg-red-50 transition cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <AlertCircle size={14} className="text-red-500" /> แจ้งปัญหาเกี่ยวกับออเดอร์นี้
            </button>

          </div>
        )}

      </div>
    </div>
  );
}