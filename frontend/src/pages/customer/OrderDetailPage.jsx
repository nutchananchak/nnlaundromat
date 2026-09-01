import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Receipt, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Repeat, 
  AlertCircle,
  Sparkles,
  ShieldCheck,
  Bike,
  Store,
  Truck,
  Phone,
  UserCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { orders } = useApp();

  // ดึงข้อมูลออเดอร์
  const order = orders?.find(o => o.id === id) || {
    id: id || 'NN-1024',
    status: id?.includes('739') ? 'completed' : 'in_progress',
    statusStep: 5,
    statusTitle: 'กำลังซักอบ',
    estimatedTime: 'คาดว่าจะส่งคืน วันนี้ 18:00 น.',
    serviceName: 'ซัก อบ พับ',
    packageName: 'ไซส์ M (ไม่เกิน 10 กก.)',
    servicePrice: 180,
    price: 180,
    date: '1 ก.ย. 2026',
    time: '10:30 น.',
    createdAt: '1 ก.ย. 2026 • 10:30 น.',
    paymentMethod: 'พร้อมเพย์ (สแกน QR Code)',
    paymentStatus: 'ชำระเงินแล้ว',
    pickupTime: '10:00 - 11:00 น.',
    deliveryTime: '17:30 - 18:30 น.',
    address: 'หอพักใจดี ห้อง 204 (ซอยพหลโยธิน 34)',
    note: 'ผ้าสีแยกถุงไว้ให้แล้วค่ะ',
    rider: {
      name: 'สมชาย ขยันส่ง (ไรเดอร์ N&N)',
      phone: '089-987-6543',
      vehicle: 'Honda Wave 110i (1กข-9921)'
    }
  };

  const riderInfo = order.rider || {
    name: 'สมชาย ขยันส่ง (ไรเดอร์ N&N)',
    phone: '089-987-6543',
    vehicle: 'Honda Wave 110i (1กข-9921)'
  };

  // ตรวจสอบว่าเป็นออเดอร์ที่เสร็จสิ้นแล้วหรือไม่
  const isCompleted = order.status === 'completed' || id?.includes('739');

  // ไทม์ไลน์ขั้นตอนการซัก (สำหรับออเดอร์ที่กำลังดำเนินการ)
  const steps = [
    { step: 1, title: 'ตรวจสอบยอดเงิน', desc: 'ระบบยืนยันสลิปการโอนเงินเรียบร้อย', time: '10:35 น.' },
    { step: 2, title: 'รอรับงาน', desc: 'จัดสรรไรเดอร์เข้ารับผ้าตามรอบ', time: '10:45 น.' },
    { step: 3, title: 'กำลังมารับผ้า', desc: 'ไรเดอร์กำลังเดินทางไปยังที่อยู่ของคุณ', time: '11:00 น.' },
    { step: 4, title: 'รับผ้าแล้วนำส่งร้าน', desc: 'ผ้าถึงร้าน N&N Laundromat สาขาหลัก', time: '11:15 น.' },
    { step: 5, title: 'กำลังซักอบ', desc: 'แยกผ้าและซักอบด้วยเครื่องมาตรฐาน สะอาด ปลอดภัย', time: '11:30 น.' },
    { step: 6, title: 'อยู่ระหว่างส่งคืนผ้า', desc: 'ไรเดอร์กำลังนำผ้าสะอาดพับเรียบร้อยไปส่งคืน', time: 'รอเวลา 17:30 น.' },
    { step: 7, title: 'ส่งคืนผ้าสำเร็จ', desc: 'ส่งมอบผ้าสะอาดเรียบร้อย ขอบคุณที่ใช้บริการ', time: 'รอเวลา 18:00 น.' },
  ];

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
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition cursor-pointer shrink-0"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <p className="text-white/80 text-xs font-medium">
              {isCompleted ? 'ใบเสร็จรับเงิน' : 'ติดตามสถานะออเดอร์'}
            </p>
            <h1 className="font-bold text-white text-lg tracking-tight">#{order.id}</h1>
          </div>
        </div>

        {/* ================= แบบที่ 1: กำลังดำเนินการ (หน้าติดตามผ้า) ================= */}
        {!isCompleted ? (
          <div className="flex-1 overflow-y-auto px-5 py-5 pb-28 flex flex-col gap-4">
            
            {/* การ์ดสถานะปัจจุบัน */}
            <div className="bg-white p-5 rounded-3xl border border-blue-100 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[11px] text-gray-400 font-medium block">สถานะปัจจุบัน</span>
                <h2 className="font-extrabold text-lg text-[#1d61f2] mt-0.5">{order.statusTitle || 'กำลังซักอบ'}</h2>
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  <Clock size={12} className="text-[#1d61f2]" />
                  {order.estimatedTime || 'คาดว่าจะส่งคืน วันนี้ 18:00 น.'}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-50 text-[#1d61f2] rounded-2xl flex items-center justify-center shadow-inner">
                <Sparkles size={24} />
              </div>
            </div>

            {/* ผู้ดูแลการจัดส่ง / ไรเดอร์ */}
            <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#1d61f2] flex items-center justify-center shrink-0">
                  <Bike size={20} />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block font-medium">ผู้ดูแลการจัดส่ง</span>
                  <span className="text-xs font-bold text-gray-800 block">{riderInfo.name}</span>
                  <span className="text-[10px] text-gray-500">{riderInfo.vehicle}</span>
                </div>
              </div>
              <a
                href={`tel:${riderInfo.phone}`}
                className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-100 transition shadow-sm"
                title="โทรหาผู้ดูแลการจัดส่ง"
              >
                <Phone size={16} />
              </a>
            </div>

            {/* ไทม์ไลน์สถานะผ้า */}
            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-3">
              <h3 className="font-bold text-xs text-gray-900">ไทม์ไลน์ขั้นตอนการให้บริการ</h3>

              <div className="flex flex-col gap-4 relative pl-3 border-l-2 border-blue-100 ml-2 mt-1">
                {steps.map((s, idx) => {
                  const currentStep = order.statusStep || 5;
                  const isCurrent = s.step === currentStep;
                  const isDone = s.step <= currentStep;

                  return (
                    <div key={idx} className="relative flex flex-col">
                      <div className={`absolute -left-[19px] top-0.5 w-3 h-3 rounded-full ${
                        isCurrent
                          ? 'bg-[#1d61f2] ring-4 ring-blue-100'
                          : isDone
                          ? 'bg-[#1d61f2]'
                          : 'bg-gray-200'
                      }`}></div>

                      <div className="flex items-center justify-between">
                        <span className={`text-xs ${
                          isCurrent ? 'font-bold text-[#1d61f2]' : isDone ? 'font-semibold text-gray-800' : 'text-gray-400'
                        }`}>
                          {s.title}
                        </span>
                        <span className="text-[10px] text-gray-400">{s.time}</span>
                      </div>
                      <p className="text-[11px] text-gray-400 leading-snug mt-0.5">{s.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ข้อมูลคำสั่งซื้อและสถานที่ */}
            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-3 text-xs">
              <span className="font-bold text-gray-900">ข้อมูลคำสั่งซื้อ</span>
              
              <div className="flex justify-between text-gray-600 pb-2 border-b border-gray-50">
                <span>บริการ</span>
                <span className="font-bold text-gray-800">{order.serviceName} ({order.packageName})</span>
              </div>
              
              <div className="flex justify-between text-gray-600 pb-2 border-b border-gray-50">
                <span>เวลานัดรับผ้า</span>
                <span className="font-medium text-gray-800">{order.pickupTime}</span>
              </div>

              <div className="flex items-start gap-2 text-gray-600 pt-1">
                <MapPin size={15} className="text-[#1d61f2] shrink-0 mt-0.5" />
                <span>{order.address}</span>
              </div>

              {order.note && (
                <div className="bg-amber-50 border border-amber-100 p-2.5 rounded-xl text-[11px] text-amber-800">
                  <span className="font-bold">หมายเหตุ: </span>{order.note}
                </div>
              )}
            </div>

            {/* ปุ่มแจ้งปัญหา */}
            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="w-full py-3 rounded-2xl bg-white border border-gray-200 text-gray-600 font-bold text-xs hover:bg-gray-50 transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <AlertCircle size={14} className="text-amber-500" /> แจ้งปัญหาเกี่ยวกับออเดอร์นี้
            </button>

          </div>
        ) : (
          /* ================= แบบที่ 2: เสร็จสิ้นแล้ว (ใบเสร็จรับเงินเดิม + ข้อมูลผู้ดูแลการจัดส่ง) ================= */
          <div className="flex-1 overflow-y-auto px-5 py-5 pb-28 flex flex-col gap-4">
            
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4 relative">
              
              {/* หัวใบเสร็จ */}
              <div className="flex flex-col items-center text-center pb-4 border-b border-dashed border-gray-200">
                <div className="w-12 h-12 rounded-full bg-blue-50 text-[#1d61f2] flex items-center justify-center mb-2 shadow-inner">
                  <Receipt size={24} />
                </div>
                <h2 className="font-bold text-base text-gray-900">N&N Laundromat</h2>
                <p className="text-[11px] text-gray-400">บริการรับ-ส่ง ซัก อบ พับ ถึงที่</p>
                
                <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold border border-emerald-100">
                  <CheckCircle2 size={13} /> {order.paymentStatus || 'ชำระเงินแล้ว'}
                </div>
              </div>

              {/* ข้อมูลการสั่งซื้อ */}
              <div className="flex flex-col gap-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">หมายเลขออเดอร์</span>
                  <span className="font-bold text-gray-800">#{order.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">วันที่ทำรายการ</span>
                  <span className="font-medium text-gray-700">{order.date || order.createdAt} • {order.time || '14:15 น.'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">วิธีการชำระเงิน</span>
                  <span className="font-medium text-gray-700">{order.paymentMethod || 'พร้อมเพย์ (สแกน QR Code)'}</span>
                </div>
              </div>

              <div className="h-[1px] bg-gray-100"></div>

              {/* รายการบริการ */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-gray-800">รายการบริการ</span>
                
                <div className="bg-gray-50/80 p-3.5 rounded-2xl flex flex-col gap-2">
                  <div className="flex justify-between items-start text-xs">
                    <div>
                      <span className="font-bold text-gray-900 block">{order.serviceName}</span>
                      <span className="text-[11px] text-gray-500">{order.packageName}</span>
                    </div>
                    <span className="font-bold text-gray-900">{order.servicePrice || order.price} ฿</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-xs text-gray-500 pt-1 border-t border-gray-200/60">
                    <span>ค่าบริการรับ-ส่ง</span>
                    <span className="font-medium text-emerald-600">ฟรี</span>
                  </div>
                </div>
              </div>

              {/* สรุปยอดเงิน */}
              <div className="flex justify-between items-center pt-2 border-t border-dashed border-gray-200">
                <span className="font-bold text-sm text-gray-900">ยอดชำระสุทธิ</span>
                <span className="font-extrabold text-lg text-[#1d61f2]">{order.totalPrice || order.price} บาท</span>
              </div>

              <div className="h-[1px] bg-gray-100"></div>

              {/* ส่วนข้อมูลผู้ดูแลการจัดส่งในใบเสร็จ */}
              <div className="flex flex-col gap-2 text-xs">
                <span className="font-bold text-gray-800">ผู้ดูแลการจัดส่ง</span>
                <div className="bg-gray-50/80 p-3 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-[#1d61f2] flex items-center justify-center">
                      <UserCheck size={16} />
                    </div>
                    <div>
                      <span className="font-bold text-gray-800 block">{riderInfo.name}</span>
                      <span className="text-[10px] text-gray-500">{riderInfo.vehicle}</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-medium text-gray-600">{riderInfo.phone}</span>
                </div>
              </div>

              <div className="h-[1px] bg-gray-100"></div>

              {/* กำหนดการรับ-ส่งและที่อยู่ */}
              <div className="flex flex-col gap-2 text-xs">
                <span className="font-bold text-gray-800">กำหนดการรับ-ส่ง</span>
                
                <div className="flex items-start gap-2.5 text-gray-600">
                  <Clock size={15} className="text-[#1d61f2] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium text-gray-800 block">เวลารับผ้า: {order.pickupTime}</span>
                    <span className="font-medium text-gray-800 block">เวลาส่งคืน: {order.deliveryTime || '19:00 - 20:00 น.'}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 text-gray-600 mt-1">
                  <MapPin size={15} className="text-[#1d61f2] shrink-0 mt-0.5" />
                  <span>{order.address}</span>
                </div>

                {order.note && (
                  <div className="mt-1 bg-amber-50/70 border border-amber-100 p-2.5 rounded-xl text-[11px] text-amber-800">
                    <span className="font-bold">หมายเหตุ: </span>{order.note}
                  </div>
                )}
              </div>

            </div>

            {/* ปุ่มสั่งบริการนี้อีกครั้ง */}
            <button
              type="button"
              onClick={handleReorder}
              className="w-full py-3.5 rounded-2xl bg-[#1d61f2] text-white font-bold text-xs shadow-md shadow-blue-500/20 active:scale-[0.98] transition cursor-pointer flex items-center justify-center gap-2"
            >
              <Repeat size={15} /> สั่งบริการนี้อีกครั้ง
            </button>

            {/* ปุ่มแจ้งปัญหา */}
            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="w-full py-3 rounded-2xl bg-white border border-gray-200 text-gray-600 font-bold text-xs hover:bg-gray-50 transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <AlertCircle size={14} className="text-amber-500" /> แจ้งปัญหาเกี่ยวกับออเดอร์นี้
            </button>

          </div>
        )}

      </div>
    </div>
  );
}