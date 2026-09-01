import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Package, 
  Clock, 
  ChevronRight, 
  CheckCircle2, 
  Plus, 
  RotateCw, 
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import BottomNav from '../../components/layout/BottomNav';
import { useApp } from '../../context/AppContext';

export default function OrdersPage() {
  const navigate = useNavigate();
  const { orders } = useApp();
  const [activeTab, setActiveTab] = useState('in_progress'); // 'in_progress' | 'history'

  const inProgressOrders = orders.filter(o => o.status === 'in_progress');
  const historyOrders = orders.filter(o => o.status === 'completed');

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
      {/* Mobile Screen Container */}
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

        {/* Header แบบเดิมเป๊ะ */}
        <div style={{
          background: 'linear-gradient(135deg, #1d61f2 0%, #1045b8 100%)',
          color: '#ffffff',
          boxShadow: '0 10px 25px rgba(29, 97, 242, 0.25)',
          flexShrink: 0
        }} className="rounded-b-3xl px-6 pt-6 pb-6 flex items-center justify-between z-20">
          <div>
            <p className="text-white/80 text-xs font-medium">N&N Laundromat</p>
            <h1 className="font-bold text-white text-xl tracking-tight">รายการออเดอร์</h1>
          </div>

          {/* ปุ่ม + สร้างออเดอร์ใหม่ */}
          <button
            type="button"
            onClick={() => navigate('/order/new')}
            className="w-10 h-10 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition active:scale-95 cursor-pointer shadow-sm"
          >
            <Plus size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-5 py-5 pb-32 flex flex-col gap-4">

          {/* แท็บสลับ กำลังดำเนินการ / ประวัติสำเร็จ สไตล์ปุ่มเดิม */}
          <div className="bg-gray-200/70 p-1.5 rounded-2xl flex gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('in_progress')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'in_progress'
                  ? 'bg-white text-[#1d61f2] shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <RotateCw size={13} className={activeTab === 'in_progress' ? 'text-[#1d61f2]' : 'text-gray-400'} />
              <span>กำลังดำเนินการ ({inProgressOrders.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'history'
                  ? 'bg-white text-[#1d61f2] shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <CheckCircle2 size={13} className={activeTab === 'history' ? 'text-[#1d61f2]' : 'text-gray-400'} />
              <span>ประวัติสำเร็จ ({historyOrders.length})</span>
            </button>
          </div>

          {/* ================= รายการในแท็บ: กำลังดำเนินการ ================= */}
          {activeTab === 'in_progress' && (
            inProgressOrders.length === 0 ? (
              <div className="py-20 text-center text-gray-400 text-xs font-medium">
                ไม่มีออเดอร์ที่กำลังดำเนินการ
              </div>
            ) : (
              inProgressOrders.map((order) => {
                const currentStep = order.statusStep || 5;
                const totalSteps = 7;
                const progressPercent = (currentStep / totalSteps) * 100;

                return (
                  <div
                    key={order.id}
                    onClick={() => navigate(`/orders/${order.id}`)}
                    className="bg-white rounded-3xl p-5 border border-blue-100 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col gap-3.5"
                  >
                    {/* แถวบน: ไอคอนกล่อง + รหัสออเดอร์ + Badge สถานะ */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Package size={20} className="text-[#1d61f2]" />
                        <span className="font-extrabold text-sm text-gray-900">#{order.id}</span>
                      </div>

                      {/* Badge สถานะสีส้ม/ทองตามรูป */}
                      <span className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full flex items-center gap-1.5">
                        <ShieldCheck size={13} className="text-amber-600" />
                        {order.statusTitle || 'กำลังซักอบ'}
                      </span>
                    </div>

                    {/* รายละเอียดบริการ / แพ็กเกจ / รอบเข้ารับ */}
                    <div className="flex flex-col gap-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-400">บริการ</span>
                        <span className="font-bold text-gray-800">{order.serviceName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">แพ็กเกจ</span>
                        <span className="font-medium text-gray-700">{order.packageName}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 flex items-center gap-1">
                          <Clock size={12} /> รอบเข้ารับ
                        </span>
                        <span className="font-medium text-gray-700">วันนี้ • {order.pickupTime}</span>
                      </div>
                    </div>

                    {/* เส้น Progress Bar ความคืบหน้า */}
                    <div className="flex flex-col gap-1.5 pt-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="font-bold text-gray-600">ความคืบหน้า</span>
                        <span className="text-gray-400 font-medium">ขั้นตอน {currentStep} จาก {totalSteps}</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#1d61f2] rounded-full transition-all duration-500"
                          style={{ width: `${progressPercent}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* แถวล่าง: ยอดชำระแล้ว + ปุ่มดูรายละเอียด > */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                      <div>
                        <span className="text-[10px] text-gray-400 block font-medium">ยอดชำระแล้ว</span>
                        <span className="font-extrabold text-base text-[#1d61f2]">{order.price} ฿</span>
                      </div>

                      <div className="flex items-center gap-1 text-xs font-bold text-gray-700 hover:text-[#1d61f2] transition">
                        <span>ดูรายละเอียด</span>
                        <ChevronRight size={15} />
                      </div>
                    </div>
                  </div>
                );
              })
            )
          )}

          {/* ================= รายการในแท็บ: ประวัติสำเร็จ ================= */}
          {activeTab === 'history' && (
            historyOrders.length === 0 ? (
              <div className="py-20 text-center text-gray-400 text-xs font-medium">
                ยังไม่มีประวัติรายการสำเร็จ
              </div>
            ) : (
              historyOrders.map((order) => (
                <div
                  key={order.id}
                  onClick={() => navigate(`/orders/${order.id}`)}
                  className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col gap-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Package size={20} className="text-emerald-600" />
                      <span className="font-extrabold text-sm text-gray-900">#{order.id}</span>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1">
                      <CheckCircle2 size={13} className="text-emerald-600" /> สำเร็จแล้ว
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-400">บริการ</span>
                      <span className="font-bold text-gray-800">{order.serviceName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">แพ็กเกจ</span>
                      <span className="font-medium text-gray-700">{order.packageName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">วันที่ทำรายการ</span>
                      <span className="font-medium text-gray-700">{order.createdAt}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                    <div>
                      <span className="text-[10px] text-gray-400 block font-medium">ยอดชำระสุทธิ</span>
                      <span className="font-extrabold text-base text-gray-900">{order.price} ฿</span>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-bold text-[#1d61f2]">
                      <span>ดูใบเสร็จ</span>
                      <ChevronRight size={15} />
                    </div>
                  </div>
                </div>
              ))
            )
          )}

        </div>

        {/* เมนูด้านล่าง */}
        <BottomNav />
      </div>
    </div>
  );
}