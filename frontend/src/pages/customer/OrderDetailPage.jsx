import React, { useMemo } from 'react';
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
  Bike,
  Phone,
  UserCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { orders } = useApp ? useApp() : {};

  // ค้นหาออเดอร์จริงโดยเทียบ ID เป็น String เสมอ
  const matchedOrder = (orders || []).find(o => String(o.id) === String(id));

  // ดึงข้อมูลออเดอร์
  const order = matchedOrder || {
    id: id || 'NN-1024',
    status: 'completed',
    statusStep: 7,
    statusTitle: 'จัดส่งผ้าคืนสำเร็จ',
    serviceName: 'ซัก อบ พับ',
    packageName: 'ตะกร้า M',
    servicePrice: 180,
    price: 180,
    totalPrice: 180,
    createdAt: '-',
    deliveredAt: '-',
    pickupTime: '10:00 - 11:00 น.',
    deliveryTime: '17:30 - 18:30 น.',
    address: 'หอพักใจดี ห้อง 204',
    paymentStatus: 'ชำระเงินแล้ว',
    rider: {
      name: 'วรรณา สีดา',
      phone: '089-111-2233',
      vehicle: 'ฮอนด้า เวฟ สีน้ำเงิน'
    }
  };

  const riderInfo = order.rider || {
    name: 'วรรณา สีดา',
    phone: '089-111-2233',
    vehicle: 'ไรเดอร์ประจำร้าน N&N'
  };

  // ตรวจสอบว่าออเดอร์สำเร็จแล้วหรือไม่
  const isCompleted = 
    order.status === 'completed' || 
    Number(order.statusStep) === 7 || 
    order.isCompleted === true ||
    order.statusTitle?.includes('สำเร็จ');

  const currentStep = Number(order.statusStep) || (isCompleted ? 7 : 1);
  const orderCreatedTimestamp = order.createdAt || '-';

  // เวลาส่งมอบจริงที่ไรเดอร์เป็นผู้กดยืนยัน (ถ้ายังไม่เสร็จให้แสดงขีดหรือรอบส่ง)
  const realDeliveredTimestamp = order.deliveredAt || (isCompleted ? '-' : (order.deliveryTime || '-'));

  // ไทม์ไลน์ขั้นตอน
  const steps = useMemo(() => {
    return [
      { 
        step: 1, 
        title: 'ตรวจสอบยอดเงิน', 
        desc: 'ระบบยืนยันสลิปการโอนเงินเรียบร้อย', 
        time: order.verifiedAt || orderCreatedTimestamp 
      },
      { 
        step: 2, 
        title: 'จัดสรรไรเดอร์', 
        desc: `มอบหมายงานให้คุณ ${riderInfo.name}`, 
        time: currentStep >= 2 ? (order.verifiedAt || 'ดำเนินการแล้ว') : 'รอดำเนินการ' 
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
        time: currentStep >= 5 ? (order.washedAt ? 'เสร็จสิ้น' : 'กำลังดำเนินการ') : 'รอเริ่มซัก' 
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
        time: order.deliveredAt || (isCompleted ? 'ส่งมอบแล้ว' : 'รอส่งมอบ') 
      },
    ];
  }, [currentStep, order, orderCreatedTimestamp, riderInfo.name, isCompleted]);

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
                <h2 className="font-extrabold text-lg text-[#1d61f2] mt-0.5">{order.statusTitle || 'กำลังดำเนินการ'}</h2>
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  <Clock size={12} className="text-[#1d61f2]" />
                  <span>รอบจัดส่งคืน: {order.deliveryTime || 'ภายในวันนี้'}</span>
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
                  <span className="text-[10px] text-gray-400 block font-medium">ผู้ดูแลการจัดส่ง (ไรเดอร์)</span>
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
                <span>สร้างคำสั่งซื้อเมื่อ</span>
                <span className="font-bold text-gray-800">{orderCreatedTimestamp}</span>
              </div>

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
          /* ================= แบบที่ 2: เสร็จสิ้นแล้ว (ใบเสร็จรับเงิน เรียบง่าย สุภาพ) ================= */
          <div className="flex-1 overflow-y-auto px-5 py-5 pb-28 flex flex-col gap-4">
            
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4 relative">
              
              {/* หัวใบเสร็จ */}
              <div className="flex flex-col items-center text-center pb-4 border-b border-dashed border-gray-200">
                <div className="w-12 h-12 rounded-full bg-blue-50 text-[#1d61f2] flex items-center justify-center mb-2 shadow-inner">
                  <Receipt size={24} />
                </div>
                <h2 className="font-bold text-base text-gray-900">N&amp;N Laundromat</h2>
                <p className="text-[11px] text-gray-400">บริการรับ-ส่ง ซัก อบ พับ ถึงหน้าห้องพักคุณ</p>
                
                <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200">
                  <CheckCircle2 size={13} className="text-emerald-600" /> จัดส่งผ้าคืนสำเร็จ
                </div>
              </div>

              {/* ข้อมูลการสั่งซื้อ */}
              <div className="flex flex-col gap-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">หมายเลขออเดอร์</span>
                  <span className="font-bold text-gray-800">#{order.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">วันเวลาที่สั่งซื้อ</span>
                  <span className="font-medium text-gray-700">{orderCreatedTimestamp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">เวลาส่งมอบผ้าสำเร็จ</span>
                  <span className="font-medium text-gray-700">{realDeliveredTimestamp}</span>
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
                      <span className="text-[11px] text-gray-500">{order.packageName || 'แพ็กเกจมาตรฐาน'}</span>
                    </div>
                    <span className="font-bold text-gray-900">{Number(order.totalPrice || order.price || 0).toLocaleString()} ฿</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-xs text-gray-500 pt-1 border-t border-gray-200/60">
                    <span>ค่าบริการรับ-ส่ง</span>
                    <span className="font-medium text-slate-700">ฟรี</span>
                  </div>
                </div>
              </div>

              {/* สรุปยอดเงิน */}
              <div className="flex justify-between items-center pt-2 border-t border-dashed border-gray-200">
                <span className="font-bold text-sm text-gray-900">ยอดชำระสุทธิ</span>
                <span className="font-extrabold text-lg text-[#1d61f2]">{Number(order.totalPrice || order.price || 0).toLocaleString()} บาท</span>
              </div>

              <div className="h-[1px] bg-gray-100"></div>

              {/* ข้อมูลผู้ดูแลการจัดส่ง */}
              <div className="flex flex-col gap-2 text-xs">
                <span className="font-bold text-gray-800">ผู้ดูแลการจัดส่ง</span>
                <div className="bg-gray-50/80 p-3 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-slate-200/70 text-slate-600 flex items-center justify-center">
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

              {/* กำหนดการรับ-ส่งและที่อยู่ (สีตัวหนังสือมาตรฐาน สุภาพ) */}
              <div className="flex flex-col gap-2 text-xs">
                <span className="font-bold text-gray-800">กำหนดการรับ-ส่ง</span>
                
                <div className="flex items-start gap-2.5 text-gray-600">
                  <Clock size={15} className="text-[#1d61f2] shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="text-gray-700 block">
                      รอบเวลารับผ้า: <span className="font-medium text-gray-800">{order.pickupTime || '-'}</span>
                    </span>
                    <span className="text-gray-700 block">
                      เวลาส่งมอบสำเร็จ: <span className="font-medium text-gray-800">{realDeliveredTimestamp}</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 text-gray-600 mt-1">
                  <MapPin size={15} className="text-[#1d61f2] shrink-0 mt-0.5" />
                  <span className="text-gray-700">{order.address}</span>
                </div>
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