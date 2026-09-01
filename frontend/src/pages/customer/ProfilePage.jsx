import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Phone, 
  MapPin, 
  Edit3, 
  AlertCircle, 
  LogOut, 
  ChevronRight, 
  X, 
  Check, 
  ShieldCheck, 
  Camera,
  Plus,
  Trash2,
  Navigation
} from 'lucide-react';
import BottomNav from '../../components/layout/BottomNav';

export default function ProfilePage() {
  const navigate = useNavigate();

  // ข้อมูลโปรไฟล์ของผู้ใช้งาน (ไม่มี email และค่าเริ่มต้นรูปภาพเป็น null)
  const [profile, setProfile] = useState({
    name: 'ซักผ้า สะอาดดี',
    phone: '081-234-5678',
    avatar: null, // เริ่มต้นไม่มีรูป แสดงไอคอน User
  });

  // รายการที่อยู่ปักหมุด สูงสุด 3 ที่อยู่
  const [addresses, setAddresses] = useState([
    {
      id: 'addr-1',
      title: 'หอพัก (ค่าเริ่มต้น)',
      detail: 'หอพักใจดี ห้อง 204 (ซอยพหลโยธิน 34)',
      lat: 13.8415,
      lng: 100.5789,
      isDefault: true,
    },
    {
      id: 'addr-2',
      title: 'บ้าน / คอนโด',
      detail: 'คอนโดลุมพินี พาร์ค อาคาร B ชั้น 12 ห้อง 1205',
      lat: 13.8322,
      lng: 100.5712,
      isDefault: false,
    }
  ]);

  // Modal: แก้ไขข้อมูลส่วนตัว
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [editName, setEditName] = useState(profile.name);
  const [editPhone, setEditPhone] = useState(profile.phone);

  // Modal: จัดการที่อยู่ / เพิ่มที่อยู่ใหม่
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressTitle, setAddressTitle] = useState('');
  const [addressDetail, setAddressDetail] = useState('');
  const [isSimulatingMap, setIsSimulatingMap] = useState(false);

  // Modal: รายงานปัญหา
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportTopic, setReportTopic] = useState('order_issue');
  const [reportOrderNumber, setReportOrderNumber] = useState('');
  const [reportDetail, setReportDetail] = useState('');
  const [reportSuccess, setReportSuccess] = useState(false);

  // ฟังก์ชันอัปโหลดรูปโปรไฟล์ของลูกค้าเอง
  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setProfile(prev => ({
        ...prev,
        avatar: imageUrl
      }));
    }
  };

  // บันทึกแก้ไขโปรไฟล์
  const handleSaveProfile = (e) => {
    e.preventDefault();
    setProfile(prev => ({
      ...prev,
      name: editName,
      phone: editPhone
    }));
    setShowEditProfileModal(false);
  };

  // เปิดฟอร์มเพิ่ม/แก้ไขที่อยู่
  const handleOpenAddressForm = (addr = null) => {
    if (addr) {
      setEditingAddressId(addr.id);
      setAddressTitle(addr.title.replace(' (ค่าเริ่มต้น)', ''));
      setAddressDetail(addr.detail);
    } else {
      if (addresses.length >= 3) {
        alert('คุณสามารถบันทึกที่อยู่ได้สูงสุด 3 ตำแหน่ง');
        return;
      }
      setEditingAddressId(null);
      setAddressTitle('');
      setAddressDetail('');
    }
    setShowAddressModal(true);
  };

  // บันทึกที่อยู่ (เพิ่มหรือแก้ไข)
  const handleSaveAddress = (e) => {
    e.preventDefault();
    if (!addressTitle.trim() || !addressDetail.trim()) {
      alert('กรุณากรอกข้อมูลที่อยู่ให้ครบถ้วน');
      return;
    }

    if (editingAddressId) {
      setAddresses(prev => prev.map(a => a.id === editingAddressId ? {
        ...a,
        title: addressTitle,
        detail: addressDetail
      } : a));
    } else {
      const newAddr = {
        id: 'addr-' + Date.now(),
        title: addressTitle,
        detail: addressDetail,
        lat: 13.8400,
        lng: 100.5750,
        isDefault: addresses.length === 0
      };
      setAddresses(prev => [...prev, newAddr]);
    }
    setShowAddressModal(false);
  };

  // ตั้งเป็นที่อยู่เริ่มต้น
  const handleSetDefaultAddress = (id) => {
    setAddresses(prev => prev.map(a => ({
      ...a,
      isDefault: a.id === id
    })));
  };

  // ลบที่อยู่
  const handleDeleteAddress = (id) => {
    if (addresses.length === 1) {
      alert('ต้องมีที่อยู่อย่างน้อย 1 ตำแหน่งสำหรับรับ-ส่งผ้า');
      return;
    }
    if (window.confirm('คุณต้องการลบที่อยู่นี้ใช่หรือไม่?')) {
      const remaining = addresses.filter(a => a.id !== id);
      if (remaining.length > 0 && !remaining.some(a => a.isDefault)) {
        remaining[0].isDefault = true;
      }
      setAddresses(remaining);
    }
  };

  // จำลองการปักหมุด GPS
  const handleSimulatePickMap = () => {
    setIsSimulatingMap(true);
    setTimeout(() => {
      setIsSimulatingMap(false);
      setAddressDetail('ตำแหน่งปัจจุบัน: ถ.พหลโยธิน แขวงลาดยาว เขตจตุจักร กทม. 10900');
    }, 800);
  };

  // ส่งรายงานปัญหา
  const handleSubmitReport = (e) => {
    e.preventDefault();
    if (!reportDetail.trim()) {
      alert('กรุณากรอกรายละเอียดปัญหา');
      return;
    }
    setReportSuccess(true);
    setTimeout(() => {
      setReportSuccess(false);
      setShowReportModal(false);
      setReportDetail('');
      setReportOrderNumber('');
    }, 1500);
  };

  const handleLogout = () => {
    if (window.confirm('คุณต้องการออกจากระบบใช่หรือไม่?')) {
      navigate('/login/customer');
    }
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
        }} className="rounded-b-3xl px-6 pt-6 pb-6 flex items-center justify-between z-20">
          <div>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)' }} className="text-xs font-medium">N&N Laundromat</p>
            <h1 style={{ color: '#ffffff' }} className="font-bold text-xl tracking-tight">โปรไฟล์และการตั้งค่า</h1>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 pb-28 flex flex-col gap-4">

          {/* 1. การ์ดโปรไฟล์ส่วนตัว (เริ่มต้นเป็นไอคอน + ให้ลูกค้าอัปโหลดรูปตัวเองได้) */}
          <div style={{ backgroundColor: '#ffffff', color: '#0f172a' }} className="rounded-3xl p-5 border border-gray-100 shadow-sm flex flex-col items-center text-center relative">
            
            <div className="relative mb-3">
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover border-4 border-blue-50 shadow-md"
                />
              ) : (
                <div style={{ backgroundColor: '#eff6ff', color: '#1d61f2' }} className="w-20 h-20 rounded-full flex items-center justify-center shadow-inner border-2 border-blue-100">
                  <User size={38} />
                </div>
              )}

              {/* ปุ่มกล้องสำหรับเลือกรูปภาพจากเครื่อง */}
              <label 
                className="absolute bottom-0 right-0 w-7 h-7 bg-[#1d61f2] text-white rounded-full flex items-center justify-center shadow-md cursor-pointer hover:bg-blue-700 active:scale-95 transition"
                title="เปลี่ยนรูปโปรไฟล์"
              >
                <Camera size={14} />
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleAvatarChange} 
                  className="hidden" 
                />
              </label>
            </div>

            <h2 style={{ color: '#0f172a' }} className="font-bold text-lg">{profile.name}</h2>
            <p style={{ color: '#64748b' }} className="text-xs mt-1 flex items-center justify-center gap-1.5 font-medium">
              <Phone size={13} className="text-[#1d61f2]" /> {profile.phone}
            </p>

            <div style={{ backgroundColor: '#eff6ff', color: '#1d61f2' }} className="mt-3 px-3 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 border border-blue-100">
              <ShieldCheck size={14} /> บัญชีลูกค้ายืนยันแล้ว
            </div>
          </div>

          {/* 2. เมนูแก้ไขข้อมูลส่วนตัว */}
          <div style={{ backgroundColor: '#ffffff', color: '#0f172a' }} className="rounded-3xl p-2 border border-gray-100 shadow-sm">
            <button
              type="button"
              onClick={() => {
                setEditName(profile.name);
                setEditPhone(profile.phone);
                setShowEditProfileModal(true);
              }}
              className="flex items-center justify-between p-3.5 hover:bg-gray-50 rounded-2xl transition cursor-pointer text-left w-full"
            >
              <div className="flex items-center gap-3">
                <div style={{ backgroundColor: '#eff6ff', color: '#1d61f2' }} className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0">
                  <User size={18} />
                </div>
                <div>
                  <span style={{ color: '#1e293b' }} className="text-xs font-bold block">แก้ไขข้อมูลส่วนตัว</span>
                  <span style={{ color: '#94a3b8' }} className="text-[11px]">ชื่อ - นามสกุล, เบอร์โทรศัพท์</span>
                </div>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </button>
          </div>

          {/* 3. จัดการที่อยู่ปักหมุดรับ-ส่งผ้า (สูงสุด 3 ที่อยู่) */}
          <div style={{ backgroundColor: '#ffffff', color: '#0f172a' }} className="rounded-3xl p-5 border border-gray-100 shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-[#1d61f2]" />
                <h3 style={{ color: '#0f172a' }} className="font-bold text-sm">ที่อยู่รับ-ส่งผ้า ({addresses.length}/3)</h3>
              </div>

              {addresses.length < 3 && (
                <button
                  type="button"
                  onClick={() => handleOpenAddressForm()}
                  style={{ color: '#1d61f2', backgroundColor: '#eff6ff' }}
                  className="px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1 hover:bg-blue-100 transition cursor-pointer"
                >
                  <Plus size={13} /> เพิ่มหมุด
                </button>
              )}
            </div>

            {/* รายการที่อยู่ */}
            <div className="flex flex-col gap-2.5 mt-1">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  style={{ 
                    backgroundColor: addr.isDefault ? '#f8faff' : '#ffffff',
                    borderColor: addr.isDefault ? '#bfdbfe' : '#f1f5f9'
                  }}
                  className="p-3.5 rounded-2xl border flex flex-col gap-2 transition"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span style={{ color: '#1e293b' }} className="font-bold text-xs">
                        {addr.title}
                      </span>
                      {addr.isDefault && (
                        <span style={{ backgroundColor: '#eff6ff', color: '#1d61f2' }} className="text-[10px] font-bold px-2 py-0.5 rounded-md">
                          ค่าเริ่มต้น
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleOpenAddressForm(addr)}
                        className="p-1 text-gray-400 hover:text-[#1d61f2] transition cursor-pointer"
                        title="แก้ไข"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteAddress(addr.id)}
                        className="p-1 text-gray-400 hover:text-red-500 transition cursor-pointer"
                        title="ลบ"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <p style={{ color: '#64748b' }} className="text-xs leading-relaxed">
                    {addr.detail}
                  </p>

                  {!addr.isDefault && (
                    <button
                      type="button"
                      onClick={() => handleSetDefaultAddress(addr.id)}
                      className="text-[11px] font-bold text-[#1d61f2] hover:underline self-start cursor-pointer mt-0.5"
                    >
                      ตั้งเป็นที่อยู่หลัก
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 4. รายงานปัญหาการใช้งาน */}
          <div style={{ backgroundColor: '#ffffff', color: '#0f172a' }} className="rounded-3xl p-2 border border-gray-100 shadow-sm">
            <button
              type="button"
              onClick={() => setShowReportModal(true)}
              className="flex items-center justify-between p-3.5 hover:bg-gray-50 rounded-2xl transition cursor-pointer text-left w-full"
            >
              <div className="flex items-center gap-3">
                <div style={{ backgroundColor: '#fff7ed', color: '#ea580c' }} className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0">
                  <AlertCircle size={18} />
                </div>
                <div>
                  <span style={{ color: '#1e293b' }} className="text-xs font-bold block">รายงานปัญหา / ติดต่อร้าน</span>
                  <span style={{ color: '#94a3b8' }} className="text-[11px]">แจ้งปัญหาการซัก, ไรเดอร์, หรือแอปพลิเคชัน</span>
                </div>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </button>
          </div>

          {/* 5. ปุ่มออกจากระบบ */}
          <button
            type="button"
            onClick={handleLogout}
            style={{ backgroundColor: '#fef2f2', borderColor: '#fee2e2', color: '#dc2626' }}
            className="w-full p-3.5 rounded-2xl border flex items-center justify-center gap-2 font-bold text-xs hover:bg-red-100 transition cursor-pointer shadow-sm active:scale-[0.99]"
          >
            <LogOut size={16} />
            ออกจากระบบ
          </button>

        </div>

        {/* ================= Modal 1: แก้ไขข้อมูลส่วนตัว ================= */}
        {showEditProfileModal && (
          <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center p-6 backdrop-blur-sm">
            <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl flex flex-col gap-4">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <h3 className="font-bold text-base text-gray-900">แก้ไขข้อมูลส่วนตัว</h3>
                <button 
                  type="button"
                  onClick={() => setShowEditProfileModal(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSaveProfile} className="flex flex-col gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">ชื่อ - นามสกุล</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-xl text-xs font-semibold text-gray-800 outline-none focus:border-[#1d61f2]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">เบอร์โทรศัพท์</label>
                  <input
                    type="tel"
                    required
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-xl text-xs font-semibold text-gray-800 outline-none focus:border-[#1d61f2]"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowEditProfileModal(false)}
                    className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold text-xs hover:bg-gray-50 transition cursor-pointer"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    style={{ backgroundColor: '#1d61f2', color: '#ffffff' }}
                    className="flex-1 py-2.5 rounded-xl font-bold text-xs shadow-md shadow-blue-500/20 active:scale-95 transition cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Check size={14} /> บันทึก
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ================= Modal 2: เพิ่ม / แก้ไขที่อยู่พร้อม Mock Map ================= */}
        {showAddressModal && (
          <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center p-6 backdrop-blur-sm">
            <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl flex flex-col gap-4">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
                  <MapPin size={18} className="text-[#1d61f2]" />
                  {editingAddressId ? 'แก้ไขที่อยู่' : 'เพิ่มที่อยู่ปักหมุดใหม่'}
                </h3>
                <button 
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSaveAddress} className="flex flex-col gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">ชื่อเรียกสถานที่</label>
                  <input
                    type="text"
                    required
                    placeholder="เช่น หอพัก, คอนโด, ที่ทำงาน..."
                    value={addressTitle}
                    onChange={(e) => setAddressTitle(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-xl text-xs font-semibold text-gray-800 outline-none focus:border-[#1d61f2]"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-gray-700">ตำแหน่งปักหมุด Google Map</label>
                    <button
                      type="button"
                      onClick={handleSimulatePickMap}
                      className="text-[11px] text-[#1d61f2] font-bold flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <Navigation size={12} /> {isSimulatingMap ? 'กำลังค้นหาพิกัด...' : 'ใช้ตำแหน่งปัจจุบัน'}
                    </button>
                  </div>
                  
                  <div 
                    onClick={handleSimulatePickMap}
                    className="w-full h-28 bg-slate-100 rounded-2xl border-2 border-dashed border-blue-200 relative overflow-hidden flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50/40 transition"
                  >
                    <div className="w-9 h-9 rounded-full bg-[#1d61f2] text-white flex items-center justify-center shadow-md animate-bounce mb-1">
                      <MapPin size={18} />
                    </div>
                    <span className="text-[11px] font-bold text-gray-600">แตะเพื่อเลือกหมุดบนแผนที่</span>
                    <span className="text-[9px] text-gray-400">พิกัด GPS จำลอง (13.8415, 100.5789)</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">รายละเอียดที่อยู่ / จุดสังเกต</label>
                  <textarea
                    rows="2"
                    required
                    placeholder="เช่น เลขที่ห้อง, ชั้น, ซอย, จุดสังเกตหน้าตึก..."
                    value={addressDetail}
                    onChange={(e) => setAddressDetail(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-xl text-xs font-semibold text-gray-800 outline-none focus:border-[#1d61f2] resize-none"
                  ></textarea>
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddressModal(false)}
                    className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold text-xs hover:bg-gray-50 transition cursor-pointer"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    style={{ backgroundColor: '#1d61f2', color: '#ffffff' }}
                    className="flex-1 py-2.5 rounded-xl font-bold text-xs shadow-md shadow-blue-500/20 active:scale-95 transition cursor-pointer flex items-center justify-center gap-1"
                  >
                    <Check size={14} /> บันทึกหมุด
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ================= Modal 3: รายงานปัญหา ================= */}
        {showReportModal && (
          <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center p-6 backdrop-blur-sm">
            <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl flex flex-col gap-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
                  <AlertCircle size={18} className="text-[#ea580c]" /> รายงานปัญหาการใช้งาน
                </h3>
                <button 
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {reportSuccess ? (
                <div className="py-8 flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-2 shadow-inner">
                    <Check size={26} />
                  </div>
                  <h4 className="font-bold text-sm text-gray-900">ส่งรายงานเรียบร้อยแล้ว</h4>
                  <p className="text-xs text-gray-400 mt-1">ทางร้านจะตรวจสอบและติดต่อกลับโดยเร็วที่สุด</p>
                </div>
              ) : (
                <form onSubmit={handleSubmitReport} className="flex flex-col gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">ประเภทปัญหา</label>
                    <select
                      value={reportTopic}
                      onChange={(e) => setReportTopic(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-xl text-xs font-semibold text-gray-800 outline-none focus:border-[#1d61f2] cursor-pointer"
                    >
                      <option value="order_issue">ปัญหาเกี่ยวกับผ้า / การซัก</option>
                      <option value="rider_issue">ปัญหาเกี่ยวกับไรเดอร์ / การรับ-ส่ง</option>
                      <option value="payment_issue">ปัญหาการชำระเงิน / ยอดเงิน</option>
                      <option value="system_issue">ปัญหาการใช้งานระบบ / อื่นๆ</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">หมายเลขคำสั่งซื้อ (ถ้ามี)</label>
                    <input
                      type="text"
                      placeholder="เช่น NN-849201"
                      value={reportOrderNumber}
                      onChange={(e) => setReportOrderNumber(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-xl text-xs font-semibold text-gray-800 outline-none focus:border-[#1d61f2]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">รายละเอียดปัญหา</label>
                    <textarea
                      rows="3"
                      required
                      placeholder="โปรดอธิบายปัญหาที่พบเพื่อให้เจ้าหน้าที่ช่วยเหลือได้อย่างรวดเร็ว..."
                      value={reportDetail}
                      onChange={(e) => setReportDetail(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-xl text-xs font-semibold text-gray-800 outline-none focus:border-[#1d61f2] resize-none"
                    ></textarea>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowReportModal(false)}
                      className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold text-xs hover:bg-gray-50 transition cursor-pointer"
                    >
                      ยกเลิก
                    </button>
                    <button
                      type="submit"
                      style={{ backgroundColor: '#ea580c', color: '#ffffff' }}
                      className="flex-1 py-2.5 rounded-xl font-bold text-xs shadow-md active:scale-95 transition cursor-pointer flex items-center justify-center gap-1"
                    >
                      ส่งรายงาน
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* แถบเมนูล่าง */}
        <BottomNav />
      </div>
    </div>
  );
}