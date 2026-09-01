import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, 
  QrCode, 
  CreditCard, 
  Download, 
  Copy, 
  Check, 
  Upload, 
  FileCheck2, 
  ShieldCheck,
  ShoppingBag,
  Clock
} from 'lucide-react';

export default function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation() || {};

  const orderData = location.state?.order || {
    id: 'NN-20260901',
    serviceName: 'ซัก อบ พับ',
    packageName: 'ไซส์ M (ผ้าไม่เกิน 35 ชิ้น)',
    pickupTime: '08:00 - 10:00 น.',
    address: 'หอพักใจดี ห้อง 204 (ซอยพหลโยธิน 34)',
    totalPrice: 180,
  };

  const [paymentMethod, setPaymentMethod] = useState('qrcode');
  const [copied, setCopied] = useState(false);
  const [slipImage, setSlipImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const bankAccount = {
    bankName: 'ธนาคารกสิกรไทย (KBANK)',
    accountNumber: '123-4-56789-0',
    accountName: 'บริษัท เอ็นแอนด์เอ็น ลอนดรอแมท จำกัด',
  };

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=PROMPTPAY_NN_LAUNDROMAT_ORDER_${orderData.id}_AMOUNT_${orderData.totalPrice}THB`;

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(bankAccount.accountNumber.replace(/-/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQr = () => {
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `QR_NN_Laundromat_${orderData.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSlipChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSlipImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleConfirmPayment = (e) => {
    e.preventDefault();
    if (!slipImage) {
      alert('กรุณาอัปโหลดสลิปหลักฐานการโอนเงิน');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccessModalOpen(true); // เปิด Modal แจ้งว่ากำลังรอตรวจสอบ
    }, 800);
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
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition cursor-pointer"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <p className="text-white/80 text-xs font-medium">N&N Laundromat</p>
            <h1 className="font-display font-bold text-white text-xl tracking-tight">ชำระเงิน</h1>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 pb-32 flex flex-col gap-5">
          
          {/* สรุปคำสั่งซื้อ */}
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-3">
              <span className="font-display font-bold text-gray-900 text-sm">สรุปคำสั่งซื้อ</span>
              <span className="text-xs font-semibold text-[#1d61f2] bg-blue-50 px-2.5 py-0.5 rounded-full">
                #{orderData.id}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">บริการ</span>
                <span className="text-gray-800 font-bold">{orderData.serviceName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">แพ็กเกจ</span>
                <span className="text-gray-800 font-semibold">{orderData.packageName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">รอบเวลาเข้ารับ</span>
                <span className="text-gray-800 font-semibold">{orderData.pickupTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-medium">จุดรับ-ส่งผ้า</span>
                <span className="text-gray-800 font-semibold truncate max-w-[200px] text-right">{orderData.address}</span>
              </div>
            </div>
          </div>

          {/* วิธีชำระเงิน */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">เลือกวิธีชำระเงิน</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('qrcode')}
                className={`py-3 px-4 rounded-2xl border flex items-center justify-center gap-2 font-display text-xs font-bold transition cursor-pointer ${
                  paymentMethod === 'qrcode'
                    ? 'bg-blue-50/70 border-[#1d61f2] text-[#1d61f2] shadow-sm'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-blue-200'
                }`}
              >
                <QrCode size={16} />
                พร้อมเพย์ QR
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('bank')}
                className={`py-3 px-4 rounded-2xl border flex items-center justify-center gap-2 font-display text-xs font-bold transition cursor-pointer ${
                  paymentMethod === 'bank'
                    ? 'bg-blue-50/70 border-[#1d61f2] text-[#1d61f2] shadow-sm'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-blue-200'
                }`}
              >
                <CreditCard size={16} />
                โอนผ่านเลขบัญชี
              </button>
            </div>
          </div>

          {/* รายละเอียด QR / บัญชี */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center text-center">
            {paymentMethod === 'qrcode' ? (
              <>
                <p className="text-xs text-gray-500 font-medium mb-3">สแกน QR Code ผ่านแอปธนาคารใดก็ได้</p>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-2xl mb-3 shadow-inner">
                  <img
                    src={qrCodeUrl}
                    alt="PromptPay QR Code"
                    className="w-44 h-44 object-contain rounded-lg"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleDownloadQr}
                  className="flex items-center gap-2 text-xs font-bold text-[#1d61f2] bg-blue-50 px-4 py-2 rounded-xl border border-blue-100 hover:bg-blue-100 transition cursor-pointer"
                >
                  <Download size={14} />
                  บันทึกรูป QR Code
                </button>
              </>
            ) : (
              <div className="w-full text-left space-y-3">
                <div className="p-3.5 bg-blue-50/50 rounded-xl border border-blue-100 space-y-2">
                  <div>
                    <span className="text-[11px] text-gray-400 font-medium">ธนาคาร</span>
                    <p className="text-xs font-bold text-gray-800">{bankAccount.bankName}</p>
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-400 font-medium">ชื่อบัญชี</span>
                    <p className="text-xs font-bold text-gray-800">{bankAccount.accountName}</p>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <span className="text-[11px] text-gray-400 font-medium">เลขที่บัญชี</span>
                      <p className="font-display text-base font-extrabold text-[#1d61f2] tracking-wider">
                        {bankAccount.accountNumber}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyAccount}
                      className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border font-bold transition cursor-pointer ${
                        copied
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-600'
                          : 'bg-white border-blue-200 text-[#1d61f2] hover:bg-blue-50'
                      }`}
                    >
                      {copied ? <Check size={13} /> : <Copy size={13} />}
                      {copied ? 'คัดลอกแล้ว' : 'คัดลอก'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* แนบสลิป */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-1">แนบสลิปหลักฐานการโอนเงิน</label>
            <p className="text-xs text-gray-500 mb-2">กรุณาแนบรูปภาพสลิปเพื่อส่งให้แอดมินตรวจสอบ</p>
            
            <label className="border-2 border-dashed border-gray-200 rounded-2xl p-4 flex flex-col items-center justify-center bg-white cursor-pointer hover:border-[#1d61f2] transition group">
              {slipImage ? (
                <div className="relative w-full h-48 flex flex-col items-center">
                  <img src={slipImage} alt="Payment Slip" className="w-full h-full object-contain rounded-xl" />
                  <span className="mt-2 text-xs font-bold text-[#1d61f2] underline">แตะเพื่อเปลี่ยนรูปสลิป</span>
                </div>
              ) : (
                <>
                  <div className="w-11 h-11 rounded-full bg-blue-50 text-[#1d61f2] flex items-center justify-center mb-2 group-hover:scale-105 transition">
                    <Upload size={20} />
                  </div>
                  <span className="text-xs font-bold text-gray-700">แตะเพื่ออัปโหลดรูปสลิป</span>
                  <span className="text-[11px] text-gray-400 mt-0.5">รองรับไฟล์ JPG, PNG</span>
                </>
              )}
              <input type="file" accept="image/*" onChange={handleSlipChange} className="hidden" />
            </label>
          </div>

          <div className="flex items-center gap-2 px-1 text-[11px] text-gray-400">
            <ShieldCheck size={16} className="text-emerald-500 shrink-0" />
            <span>หลักฐานการโอนจะถูกส่งไปยังระบบตรวจสอบของแอดมิน</span>
          </div>

        </div>

        {/* ปุ่มยืนยันชำระเงิน */}
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3.5 shadow-[0_-6px_20px_rgba(0,0,0,0.08)] flex flex-col gap-2.5 z-30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-600">
              <ShoppingBag size={16} className="text-[#1d61f2]" />
              <span className="text-xs font-semibold">ยอดที่ต้องชำระ</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="font-display font-bold text-2xl text-[#1d61f2]">{orderData.totalPrice}</span>
              <span className="text-xs font-bold text-gray-500">บาท</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleConfirmPayment}
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl bg-[#1d61f2] text-white font-display font-bold text-sm tracking-wide shadow-md shadow-blue-500/20 active:scale-[0.98] transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <FileCheck2 size={18} />
            {isSubmitting ? 'กำลังส่งหลักฐาน...' : 'ส่งหลักฐานการโอนเงิน'}
          </button>
        </div>

        {/* Modal แจ้งเตือนส่งสลิปสำเร็จ (นำทางกลับหน้า Home) */}
        {isSuccessModalOpen && (
          <div className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center p-6 backdrop-blur-sm">
            <div className="bg-white w-full max-w-sm rounded-3xl p-6 text-center shadow-2xl flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-[#1d61f2] mb-3">
                <Clock size={34} className="animate-pulse" />
              </div>
              <h3 className="font-display font-bold text-lg text-gray-900 mb-1">ส่งหลักฐานเรียบร้อยแล้ว</h3>
              <p className="text-xs text-gray-500 leading-relaxed mb-6 font-medium">
                สลิปของคุณถูกส่งไปยังเจ้าหน้าที่เพื่อตรวจสอบยอดเงิน เมื่อผ่านการตรวจสอบ ไรเดอร์จะเข้ารับผ้าตามรอบเวลาที่คุณเลือก
              </p>
              <button
                type="button"
                onClick={() => navigate('/home')}
                className="w-full py-3.5 rounded-xl bg-[#1d61f2] text-white font-display font-bold text-sm tracking-wide shadow-md shadow-blue-500/20 active:scale-[0.98] transition cursor-pointer"
              >
                กลับสู่หน้าหลัก
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}