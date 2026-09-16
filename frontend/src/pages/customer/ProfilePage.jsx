import { useState, useEffect, useRef } from 'react';
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
  Navigation, 
  ExternalLink,
  LocateFixed,
  Search,
  Compass,
  Layers
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import BottomNav from '../../components/layout/BottomNav';
import { useApp } from '../../context/AppContext';

// ✅ พิกัดร้าน N&N Laundromat จริง
const STORE_COORDS = { lat: 13.709648150061998, lng: 100.62401489583843 };
const MAX_DELIVERY_RADIUS_KM = 3.0; // รัศมีบริการไม่เกิน 3 กิโลเมตรจากร้าน

const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // รัศมีโลก (กม.)
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// หมุดร้าน N&N
const storePinIcon = L.divIcon({
  html: `
    <div style="transform: translate(-50%, -100%); display: flex; flex-direction: column; align-items: center;">
      <div style="background-color: #0f172a; color: #60a5fa; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.3); border: 2px solid white;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/></svg>
      </div>
      <div style="background-color: #0f172a; color: white; font-size: 9.5px; font-weight: bold; padding: 2px 6px; border-radius: 4px; margin-top: 2px; white-space: nowrap; box-shadow: 0 2px 4px rgba(0,0,0,0.25);">
        ร้าน N&amp;N
      </div>
    </div>
  `,
  className: 'store-leaflet-pin',
  iconSize: [60, 48],
  iconAnchor: [30, 48]
});

export default function ProfilePage() {
  const navigate = useNavigate();
  const { userProfile, setUserProfile, addresses, setAddresses, setSelectedAddressId, logoutUser } = useApp();
  
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [editName, setEditName] = useState(userProfile?.fullName || userProfile?.name || '');
  const [editPhone, setEditPhone] = useState(userProfile?.phone || '');

  useEffect(() => {
    if (userProfile) {
      setEditName(userProfile.fullName || userProfile.name || '');
      setEditPhone(userProfile.phone || '');
    }
  }, [userProfile]);

  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressTitle, setAddressTitle] = useState('');
  const [addressDetail, setAddressDetail] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // โหมดแสดงผลแผนที่: 'streets' หรือ 'satellite'
  const [mapType, setMapType] = useState('streets');

  const [addressCoords, setAddressCoords] = useState({ lat: STORE_COORDS.lat, lng: STORE_COORDS.lng + 0.001 });
  const [distanceFromStore, setDistanceFromStore] = useState(0);
  const [isWithinRange, setIsWithinRange] = useState(true);

  const [isLocating, setIsLocating] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);

  const [showReportModal, setShowReportModal] = useState(false);
  const [reportTopic, setReportTopic] = useState('order_issue');
  const [reportDetail, setReportDetail] = useState('');
  const [reportSuccess, setReportSuccess] = useState(false);

  const updateDistance = (lat, lng) => {
    const dist = calculateDistanceKm(STORE_COORDS.lat, STORE_COORDS.lng, lat, lng);
    setDistanceFromStore(dist);
    setIsWithinRange(dist <= MAX_DELIVERY_RADIUS_KM);
  };

  const fetchAddressName = async (lat, lng) => {
    updateDistance(lat, lng);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=th`
      );
      const data = await res.json();
      if (data && data.display_name) {
        setAddressDetail(data.display_name);
      } else {
        setAddressDetail(`พิกัด: ${lat.toFixed(5)}, ${lng.toFixed(5)}`);
      }
    } catch (e) {
      setAddressDetail(`พิกัด: ${lat.toFixed(5)}, ${lng.toFixed(5)}`);
    }
  };

  const handleSearchAddress = async (e) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const queryWithZone = searchQuery.includes('อ่อนนุช') || searchQuery.includes('สุขุมวิท') || searchQuery.includes('กรุงเทพ')
        ? searchQuery 
        : `${searchQuery} อ่อนนุช สุขุมวิท 77 กรุงเทพ`;

      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(queryWithZone)}&countrycodes=th&limit=1&accept-language=th`
      );
      const data = await res.json();
      if (data && data.length > 0) {
        const latitude = parseFloat(data[0].lat);
        const longitude = parseFloat(data[0].lon);

        setAddressCoords({ lat: latitude, lng: longitude });
        setAddressDetail(data[0].display_name);
        updateDistance(latitude, longitude);

        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([latitude, longitude], 18);
        }
      } else {
        alert('ไม่พบสถานที่ดังกล่าว กรุณาระบุชื่อซอย อาคาร หรือชื่อหมู่บ้าน เช่น "อ่อนนุช 25", "คอนโด..."');
      }
    } catch (err) {
      alert('เกิดข้อผิดพลาดในการค้นหาสถานที่');
    } finally {
      setIsSearching(false);
    }
  };

  // จัดการ Map Instance
  useEffect(() => {
    if (!showAddressModal) {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      return;
    }

    const timer = setTimeout(() => {
      if (!mapContainerRef.current) return;

      if (!mapInstanceRef.current) {
        const map = L.map(mapContainerRef.current, {
          center: [STORE_COORDS.lat, STORE_COORDS.lng],
          zoom: 17,
          maxZoom: 20,
          zoomControl: false
        });

        // ใช้ Google Maps Streets Tile
        const roadsUrl = 'https://mt1.google.com/vt/lyrs=m&hl=th&x={x}&y={y}&z={z}';
        const layer = L.tileLayer(roadsUrl, { attribution: '&copy; Google Maps', maxZoom: 20 }).addTo(map);
        tileLayerRef.current = layer;

        L.control.zoom({ position: 'bottomright' }).addTo(map);

        // หมุดร้าน N&N ที่พิกัดจริง
        L.marker([STORE_COORDS.lat, STORE_COORDS.lng], {
          icon: storePinIcon,
          interactive: false
        }).addTo(map);

        // วงกลมรัศมี 3 กม. รอบร้าน
        L.circle([STORE_COORDS.lat, STORE_COORDS.lng], {
          radius: MAX_DELIVERY_RADIUS_KM * 1000,
          color: '#1d61f2',
          fillColor: '#3b82f6',
          fillOpacity: 0.08,
          weight: 2,
          dashArray: '6, 8'
        }).addTo(map);

        updateDistance(addressCoords.lat, addressCoords.lng);

        // เมื่อเลื่อนแผนที่เสร็จ ให้จุดศูนย์กลางจอเป็นตำแหน่งที่ปักหมุด
        map.on('moveend', () => {
          const center = map.getCenter();
          setAddressCoords({ lat: center.lat, lng: center.lng });
          fetchAddressName(center.lat, center.lng);
        });

        mapInstanceRef.current = map;
      } else {
        mapInstanceRef.current.invalidateSize();
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [showAddressModal]);

  // สลับโหมดแผนที่ถนน / ภาพดาวเทียม
  const toggleMapType = () => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;

    mapInstanceRef.current.removeLayer(tileLayerRef.current);
    const newType = mapType === 'streets' ? 'satellite' : 'streets';
    setMapType(newType);

    const newUrl = newType === 'satellite'
      ? 'https://mt1.google.com/vt/lyrs=y&hl=th&x={x}&y={y}&z={z}'
      : 'https://mt1.google.com/vt/lyrs=m&hl=th&x={x}&y={y}&z={z}';

    const newLayer = L.tileLayer(newUrl, { attribution: '&copy; Google Maps', maxZoom: 20 }).addTo(mapInstanceRef.current);
    tileLayerRef.current = newLayer;
  };

  // ดึงตำแหน่ง GPS ของเครื่อง
  const handleGetLiveGPS = () => {
    if (!navigator.geolocation) {
      alert('อุปกรณ์ของคุณไม่รองรับการดึงพิกัด GPS');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setAddressCoords({ lat: latitude, lng: longitude });
        setIsLocating(false);

        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([latitude, longitude], 18);
        }

        fetchAddressName(latitude, longitude);
      },
      () => {
        setIsLocating(false);
        alert('ไม่พบสัญญาณพิกัด GPS คุณสามารถเลื่อนแผนที่ Google Maps เพื่อวางหมุดเป้าลงบนตำแหน่งบ้านของคุณได้เลยครับ');
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleOpenAddressForm = (addr = null) => {
    if (addr) {
      setEditingAddressId(addr.id);
      setAddressTitle(addr.title.replace(' (ค่าเริ่มต้น)', ''));
      setAddressDetail(addr.detail);
      const lat = addr.lat || STORE_COORDS.lat;
      const lng = addr.lng || STORE_COORDS.lng + 0.001;
      setAddressCoords({ lat, lng });
      updateDistance(lat, lng);
      setSearchQuery('');
    } else {
      if ((addresses || []).length >= 3) {
        alert('คุณสามารถบันทึกที่อยู่ได้สูงสุด 3 ตำแหน่ง');
        return;
      }
      setEditingAddressId(null);
      setAddressTitle('');
      setAddressDetail('');
      setSearchQuery('');
      // เริ่มต้นตั้งหมุดไว้บริเวณร้าน
      const defaultPin = { lat: STORE_COORDS.lat, lng: STORE_COORDS.lng + 0.001 };
      setAddressCoords(defaultPin);
      updateDistance(defaultPin.lat, defaultPin.lng);
    }
    setShowAddressModal(true);
  };

  const handleSaveAddress = (e) => {
    e.preventDefault();
    if (!addressTitle.trim() || !addressDetail.trim()) {
      alert('กรุณากรอกข้อมูลที่อยู่ให้ครบถ้วน');
      return;
    }

    if (!isWithinRange) {
      alert(`ขออภัยครับ ตำแหน่งนี้อยู่ห่างจากร้าน ${distanceFromStore.toFixed(2)} กม. ซึ่งเกินรัศมีให้บริการ 3 กม. ของทางร้าน`);
      return;
    }

    const currentList = addresses || [];

    if (editingAddressId) {
      setAddresses(currentList.map(a => a.id === editingAddressId ? {
        ...a,
        title: addressTitle.trim(),
        detail: addressDetail.trim(),
        lat: addressCoords.lat,
        lng: addressCoords.lng,
        distanceKm: distanceFromStore.toFixed(2)
      } : a));
    } else {
      const isFirst = currentList.length === 0;
      const newAddrId = 'addr-' + Date.now();
      const newAddr = {
        id: newAddrId,
        title: addressTitle.trim(),
        detail: addressDetail.trim(),
        lat: addressCoords.lat,
        lng: addressCoords.lng,
        distanceKm: distanceFromStore.toFixed(2),
        isDefault: isFirst
      };
      setAddresses([...currentList, newAddr]);
      if (isFirst && setSelectedAddressId) {
        setSelectedAddressId(newAddrId);
      }
    }
    setShowAddressModal(false);
  };

  const handleSetDefaultAddress = (id) => {
    if (setSelectedAddressId) {
      setSelectedAddressId(id);
    }
    setAddresses((addresses || []).map(a => ({
      ...a,
      isDefault: a.id === id
    })));
  };

  const handleDeleteAddress = (id) => {
    if (window.confirm('คุณต้องการลบที่อยู่นี้ใช่หรือไม่?')) {
      const remaining = (addresses || []).filter(a => a.id !== id);
      if (remaining.length > 0 && !remaining.some(a => a.isDefault)) {
        remaining[0].isDefault = true;
        if (setSelectedAddressId) {
          setSelectedAddressId(remaining[0].id);
        }
      }
      setAddresses(remaining);
    }
  };

  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const imageUrl = URL.createObjectURL(e.target.files[0]);
      setUserProfile(prev => {
        const updated = { ...prev, avatar: imageUrl };
        localStorage.setItem('currentUser', JSON.stringify(updated));
        return updated;
      });
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const trimmedName = editName.trim();
    if (!trimmedName) {
      alert('กรุณากรอกชื่อ - นามสกุล');
      return;
    }

    const updatedUser = {
      ...userProfile,
      name: trimmedName,
      fullName: trimmedName,
      phone: editPhone
    };

    setUserProfile(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    setShowEditProfileModal(false);
  };

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
    }, 1500);
  };

  const handleLogout = () => {
    if (window.confirm('คุณต้องการออกจากระบบใช่หรือไม่?')) {
      if (logoutUser) {
        logoutUser();
      } else {
        localStorage.removeItem('currentUser');
      }
      navigate('/login/customer');
    }
  };

  const displayName = userProfile?.fullName || userProfile?.name || 'ผู้ใช้งาน';

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
            <p style={{ color: 'rgba(255, 255, 255, 0.8)' }} className="text-xs font-medium">N&amp;N Laundromat</p>
            <h1 style={{ color: '#ffffff' }} className="font-bold text-xl tracking-tight">โปรไฟล์และการตั้งค่า</h1>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 pb-28 flex flex-col gap-4">

          {/* การ์ดโปรไฟล์ส่วนตัว */}
          <div style={{ backgroundColor: '#ffffff', color: '#0f172a' }} className="rounded-3xl p-5 border border-gray-100 shadow-sm flex flex-col items-center text-center relative">
            <div className="relative mb-3">
              {userProfile?.avatar ? (
                <img
                  src={userProfile.avatar}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover border-4 border-blue-50 shadow-md"
                />
              ) : (
                <div style={{ backgroundColor: '#eff6ff', color: '#1d61f2' }} className="w-20 h-20 rounded-full flex items-center justify-center shadow-inner border-2 border-blue-100">
                  <User size={38} />
                </div>
              )}

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

            <h2 style={{ color: '#0f172a' }} className="font-bold text-lg">{displayName}</h2>
            <p style={{ color: '#64748b' }} className="text-xs mt-1 flex items-center justify-center gap-1.5 font-medium">
              <Phone size={13} className="text-[#1d61f2]" /> {userProfile?.phone || '-'}
            </p>

            <div style={{ backgroundColor: '#eff6ff', color: '#1d61f2' }} className="mt-3 px-3 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 border border-blue-100">
              <ShieldCheck size={14} /> บัญชีลูกค้ายืนยันแล้ว
            </div>
          </div>

          {/* แก้ไขข้อมูลส่วนตัว */}
          <div style={{ backgroundColor: '#ffffff', color: '#0f172a' }} className="rounded-3xl p-2 border border-gray-100 shadow-sm">
            <button
              type="button"
              onClick={() => {
                setEditName(userProfile?.fullName || userProfile?.name || '');
                setEditPhone(userProfile?.phone || '');
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

          {/* ที่อยู่รับ-ส่งผ้า */}
          <div style={{ backgroundColor: '#ffffff', color: '#0f172a' }} className="rounded-3xl p-5 border border-gray-100 shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-[#1d61f2]" />
                <h3 style={{ color: '#0f172a' }} className="font-bold text-sm">
                  ที่อยู่รับ-ส่งผ้า ({(addresses || []).length}/3)
                </h3>
              </div>

              {(addresses || []).length < 3 && (
                <button
                  type="button"
                  onClick={() => handleOpenAddressForm()}
                  style={{ color: '#1d61f2', backgroundColor: '#eff6ff' }}
                  className="px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1 hover:bg-blue-100 transition cursor-pointer"
                >
                  <Plus size={13} /> ปักหมุดเพิ่ม
                </button>
              )}
            </div>

            {(!addresses || addresses.length === 0) ? (
              <div className="py-8 px-4 bg-slate-50 border border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center gap-2 mt-1">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-[#1d61f2] flex items-center justify-center">
                  <MapPin size={20} />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 block">ยังไม่ได้บันทึกที่อยู่จัดส่ง</span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">เปิดแผนที่ Google Maps เพื่อระบุตำแหน่งบ้าน/ห้องพัก</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleOpenAddressForm()}
                  className="mt-2 px-4 py-2 bg-[#1d61f2] text-white font-bold text-xs rounded-xl shadow-xs hover:bg-blue-700 transition cursor-pointer flex items-center gap-1.5"
                >
                  <Navigation size={13} /> เปิดแผนที่ปักหมุดบ้าน
                </button>
              </div>
            ) : (
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
                        {addr.distanceKm && (
                          <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                            ~{addr.distanceKm} กม. จากร้าน
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleOpenAddressForm(addr)}
                          className="p-1 text-gray-400 hover:text-[#1d61f2] transition cursor-pointer"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteAddress(addr.id)}
                          className="p-1 text-gray-400 hover:text-red-500 transition cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    <p style={{ color: '#64748b' }} className="text-xs leading-relaxed">
                      {addr.detail}
                    </p>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                      {!addr.isDefault ? (
                        <button
                          type="button"
                          onClick={() => handleSetDefaultAddress(addr.id)}
                          className="text-[11px] font-bold text-[#1d61f2] hover:underline cursor-pointer"
                        >
                          ตั้งเป็นที่อยู่หลัก
                        </button>
                      ) : (
                        <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                          <Check size={12} /> เลือกใช้อยู่ในปัจจุบัน
                        </span>
                      )}

                      {addr.lat && addr.lng && (
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${addr.lat},${addr.lng}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10.5px] text-slate-400 hover:text-[#1d61f2] flex items-center gap-1"
                        >
                          <ExternalLink size={11} /> เปิดใน Google Maps
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* รายงานปัญหา */}
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

          {/* ออกจากระบบ */}
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

        {/* Modal แผนที่ Google Maps เต็มพื้นที่ + Center Pin + สลับดาวเทียม */}
        {showAddressModal && (
          <div className="absolute inset-0 bg-black/70 z-50 flex items-end sm:items-center justify-center backdrop-blur-xs">
            <div className="bg-white w-full max-w-[430px] h-[92vh] max-h-[92vh] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200">
              
              {/* Header Modal */}
              <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white z-20">
                <div>
                  <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                    <MapPin size={18} className="text-[#1d61f2]" />
                    {editingAddressId ? 'แก้ไขตำแหน่งที่อยู่' : 'ระบุตำแหน่งบ้านบน Google Maps'}
                  </h3>
                  <span className="text-[11px] text-slate-400">เลื่อนแผนที่ให้เป้าตรงกับตำแหน่งบ้านของคุณ</span>
                </div>
                <button type="button" onClick={() => setShowAddressModal(false)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 cursor-pointer">
                  <X size={16} />
                </button>
              </div>

              {/* ค้นหาสถานที่ */}
              <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 shrink-0 z-20">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="พิมพ์ชื่อซอย เช่น อ่อนนุช 25, คอนโด หรืออาคาร..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSearchAddress(); } }}
                      className="w-full bg-white border border-slate-200 pl-9 pr-3 py-2 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:border-[#1d61f2]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleSearchAddress}
                    disabled={isSearching}
                    className="px-3.5 py-2 bg-[#1d61f2] hover:bg-blue-700 text-white text-xs font-bold rounded-xl cursor-pointer transition shadow-xs shrink-0"
                  >
                    {isSearching ? '...' : 'ค้นหา'}
                  </button>
                </div>
              </div>

              {/* ส่วนแสดงแผนที่ Google Maps เต็มพื้นที่ (Center Fixed Pin) */}
              <div className="flex-1 relative w-full overflow-hidden bg-slate-100">
                <div ref={mapContainerRef} className="w-full h-full z-0" />

                {/* หมุดเป้าตรงกลางจอ (Center Target Pin) */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full pointer-events-none z-10 flex flex-col items-center">
                  <div className="w-9 h-9 rounded-full bg-[#1d61f2] text-white flex items-center justify-center shadow-xl border-2 border-white ring-4 ring-blue-500/30 animate-bounce">
                    <MapPin size={20} />
                  </div>
                  <div className="w-2 h-2 rounded-full bg-slate-900/60 blur-[1px] mt-0.5"></div>
                </div>

                {/* ปุ่มสลับโหมดดาวเทียม */}
                <button
                  type="button"
                  onClick={toggleMapType}
                  className="absolute top-3 right-3 z-10 bg-white/95 backdrop-blur-xs border border-slate-200 text-slate-700 hover:text-[#1d61f2] px-3 py-1.5 rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 cursor-pointer transition active:scale-95"
                  title="สลับโหมดแผนที่ / ภาพดาวเทียม"
                >
                  <Layers size={14} className="text-[#1d61f2]" />
                  <span>{mapType === 'streets' ? 'ดูภาพดาวเทียม' : 'ดูแผนที่ถนน'}</span>
                </button>

                {/* ปุ่มดึง GPS เครื่อง */}
                <button
                  type="button"
                  onClick={handleGetLiveGPS}
                  className="absolute bottom-16 right-3 z-10 w-10 h-10 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:text-[#1d61f2] shadow-lg flex items-center justify-center cursor-pointer transition active:scale-90"
                  title="ตำแหน่งพิกัด GPS ปัจจุบัน"
                >
                  <LocateFixed size={18} className={isLocating ? 'text-blue-500 animate-spin' : ''} />
                </button>

                {/* ป้ายแจ้งเตือนระยะทาง */}
                <div className="absolute top-3 left-3 z-10 pointer-events-none">
                  <div className={`px-3 py-1.5 rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 ${
                    isWithinRange 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-red-600 text-white'
                  }`}>
                    <span>ระยะห่างจากร้าน: ~{distanceFromStore.toFixed(2)} กม.</span>
                    <span>{isWithinRange ? '(อยู่ในเขตบริการ)' : '(เกิน 3 กม.)'}</span>
                  </div>
                </div>
              </div>

              {/* ฟอร์มกรอกรายละเอียดด้านล่าง */}
              <form onSubmit={handleSaveAddress} className="p-4 bg-white border-t border-slate-100 flex flex-col gap-2.5 shrink-0 z-20">
                <div className="flex gap-2">
                  <div className="w-1/3">
                    <label className="text-[11px] font-bold text-slate-700 block mb-0.5">ชื่อสถานที่</label>
                    <input
                      type="text"
                      required
                      placeholder="เช่น บ้าน, หอพัก..."
                      value={addressTitle}
                      onChange={(e) => setAddressTitle(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 p-2 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:border-[#1d61f2]"
                    />
                  </div>

                  <div className="flex-1">
                    <label className="text-[11px] font-bold text-slate-700 block mb-0.5">รายละเอียด (บ้านเลขที่ / ห้อง / ซอย)</label>
                    <input
                      type="text"
                      required
                      placeholder="เช่น 123/4 ซอยอ่อนนุช 25 ชั้น 2..."
                      value={addressDetail}
                      onChange={(e) => setAddressDetail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 p-2 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:border-[#1d61f2]"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  <button type="button" onClick={() => setShowAddressModal(false)} className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs cursor-pointer">
                    ยกเลิก
                  </button>
                  <button 
                    type="submit" 
                    disabled={!isWithinRange}
                    className={`flex-1 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer shadow-md ${
                      isWithinRange 
                        ? 'bg-[#1d61f2] hover:bg-blue-700 text-white shadow-blue-500/20' 
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                    }`}
                  >
                    {isWithinRange ? 'ยืนยันปักหมุดตำแหน่งนี้' : 'อยู่นอกเขตให้บริการ 3 กม.'}
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}

        {/* Modal แก้ไขข้อมูลส่วนตัว */}
        {showEditProfileModal && (
          <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center p-6 backdrop-blur-sm">
            <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl flex flex-col gap-4">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <h3 className="font-bold text-base text-gray-900">แก้ไขข้อมูลส่วนตัว</h3>
                <button type="button" onClick={() => setShowEditProfileModal(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 cursor-pointer">
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
                  <button type="button" onClick={() => setShowEditProfileModal(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold text-xs cursor-pointer">
                    ยกเลิก
                  </button>
                  <button type="submit" style={{ backgroundColor: '#1d61f2', color: '#ffffff' }} className="flex-1 py-2.5 rounded-xl font-bold text-xs shadow-md cursor-pointer">
                    บันทึก
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal รายงานปัญหา */}
        {showReportModal && (
          <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center p-6 backdrop-blur-sm">
            <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl flex flex-col gap-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                <h3 className="font-bold text-base text-gray-900 flex items-center gap-2">
                  <AlertCircle size={18} className="text-[#ea580c]" /> รายงานปัญหา
                </h3>
                <button type="button" onClick={() => setShowReportModal(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 cursor-pointer">
                  <X size={16} />
                </button>
              </div>

              {reportSuccess ? (
                <div className="py-8 text-center">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-2 mx-auto">
                    <Check size={26} />
                  </div>
                  <h4 className="font-bold text-sm text-gray-900">ส่งรายงานเรียบร้อยแล้ว</h4>
                </div>
              ) : (
                <form onSubmit={handleSubmitReport} className="flex flex-col gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">ประเภทปัญหา</label>
                    <select value={reportTopic} onChange={(e) => setReportTopic(e.target.value)} className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-xl text-xs font-semibold text-gray-800 outline-none">
                      <option value="order_issue">ปัญหาเกี่ยวกับผ้า / การซัก</option>
                      <option value="rider_issue">ปัญหาเกี่ยวกับไรเดอร์</option>
                      <option value="payment_issue">ปัญหาการชำระเงิน</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">รายละเอียดปัญหา</label>
                    <textarea rows="3" required value={reportDetail} onChange={(e) => setReportDetail(e.target.value)} className="w-full bg-gray-50 border border-gray-200 p-2.5 rounded-xl text-xs font-semibold text-gray-800 outline-none resize-none"></textarea>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button type="button" onClick={() => setShowReportModal(false)} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold text-xs cursor-pointer">
                      ยกเลิก
                    </button>
                    <button type="submit" style={{ backgroundColor: '#ea580c', color: '#ffffff' }} className="flex-1 py-2.5 rounded-xl font-bold text-xs cursor-pointer">
                      ส่งรายงาน
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        <BottomNav />
      </div>
    </div>
  );
}