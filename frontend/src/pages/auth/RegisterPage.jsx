import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

// โลโก้
const ModalHeaderLogo = () => (
  <svg
    viewBox="0 0 120 120"
    width="52"
    height="52"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M21 26C21 23.2 23.2 21 26 21H72C74.8 21 77 23.2 77 26V63H21V26Z"
      fill="#0c4a7e"
    />
    <path
      d="M77 35H92C93.3 35 94.5 35.5 95.4 36.4L101.6 42.6C102.5 43.5 103 44.8 103 46.1V63H77V35Z"
      fill="#0c4a7e"
    />
    <path
      d="M82 40H90C90.7 40 91.3 40.3 91.8 40.7L95.8 44.7C96.2 45.2 96.5 45.8 96.5 46.5V52H82V40Z"
      fill="#ffffff"
    />
    <rect x="29" y="26" width="13" height="4.5" rx="1.5" fill="#ffffff" />
    <circle cx="56" cy="28" r="2.2" fill="#ffffff" />
    <circle cx="66" cy="28" r="2.2" fill="#ffffff" />
    <circle cx="49" cy="44.5" r="14" fill="#ffffff" />
    <circle cx="49" cy="44.5" r="11" fill="#0c4a7e" />
    <path
      d="M38 45.5C40 43 44.5 42 48 45.5C51.5 49 56 48 60 44V54C60 54 54.5 55.5 49 55.5C43.5 55.5 38 54 38 54V45.5Z"
      fill="#ffffff"
    />
    <circle cx="52.5" cy="40" r="1.5" fill="#ffffff" />
    <circle cx="56.5" cy="43" r="1" fill="#ffffff" />
    <rect x="19" y="62" width="86" height="4.5" rx="2" fill="#0c4a7e" />
    <circle cx="35" cy="67.5" r="9" fill="#0c4a7e" />
    <circle cx="35" cy="67.5" r="6.5" fill="#ffffff" />
    <circle cx="35" cy="67.5" r="4" fill="#0c4a7e" />
    <circle cx="87" cy="67.5" r="9" fill="#0c4a7e" />
    <circle cx="87" cy="67.5" r="6.5" fill="#ffffff" />
    <circle cx="87" cy="67.5" r="4" fill="#0c4a7e" />
    <text
      x="60"
      y="90"
      textAnchor="middle"
      fill="#0c4a7e"
      fontSize="8.5"
      fontWeight="900"
      letterSpacing="0.8"
      fontFamily="sans-serif"
    >
      N&amp;N LAUNDROMAT
    </text>
    <text
      x="60"
      y="100"
      textAnchor="middle"
      fill="#0c4a7e"
      fontSize="5.5"
      fontWeight="800"
      letterSpacing="2.2"
      fontFamily="sans-serif"
    >
      DELIVERY
    </text>
  </svg>
);

// ไอคอนแจ้งเตือนเตือนภัย (แทน ⚠️)
const AlertTriangleIcon = ({ size = 16, color = '#1e40af' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ flexShrink: 0 }}
  >
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

// ไอคอนโล่ความปลอดภัย (แทน 🛡️)
const ShieldIcon = ({ size = 16, color = '#1e40af' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ flexShrink: 0 }}
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

// ไอคอนเครื่องหมายถูกนำหน้าข้อความ
const CheckItem = ({ children, isWarning = false }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', textAlign: 'left', marginBottom: '8px' }}>
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '18px',
      height: '18px',
      backgroundColor: isWarning ? '#fee2e2' : '#e0f0ff',
      color: isWarning ? '#dc2626' : '#1d61f2',
      borderRadius: '50%',
      fontSize: '11px',
      fontWeight: '900',
      flexShrink: 0,
      marginTop: '2px'
    }}>
      {isWarning ? '✕' : '✓'}
    </span>
    <span style={{ fontSize: '13.5px', color: isWarning ? '#991b1b' : '#334155', lineHeight: '1.55', flex: 1 }}>
      {children}
    </span>
  </div>
);

// --- คอมโพเนนต์ TermsModal ---
const TermsModal = ({ isOpen, onClose, onAccept }) => {
  const [activeTab, setActiveTab] = useState('terms');

  if (!isOpen) return null;

  const handleAgree = () => {
    if (onAccept) onAccept();
    onClose();
  };

  const cardItemStyle = {
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '14px',
    padding: '16px',
    boxSizing: 'border-box',
    textAlign: 'left'
  };

  const badgeHeaderStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '15px',
    fontWeight: '700',
    color: '#0f4c81',
    marginBottom: '12px'
  };

  const numberBadge = (num) => (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '22px',
      height: '22px',
      backgroundColor: '#1d61f2',
      color: '#ffffff',
      borderRadius: '50%',
      fontSize: '12px',
      fontWeight: '700'
    }}>
      {num}
    </span>
  );

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '12px',
        boxSizing: 'border-box'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          width: '100%',
          maxWidth: '680px',
          maxHeight: '92vh',
          borderRadius: '20px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ปุ่มปิดมุมขวาบน */}
        <button
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: '#f1f5f9',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            fontSize: '18px',
            cursor: 'pointer',
            color: '#64748b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10
          }}
        >
          ×
        </button>

        {/* 1. Header */}
        <div style={{
          padding: '24px 20px 18px 20px',
          borderBottom: '1px solid #f1f5f9',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          background: '#ffffff'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            backgroundColor: '#e0f0ff',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '10px'
          }}>
            <ModalHeaderLogo />
          </div>

          <h2 style={{
            fontSize: '20px',
            fontWeight: '800',
            color: '#0f4c81',
            margin: '0 0 4px 0',
            letterSpacing: '-0.3px'
          }}>
            N&amp;N Laundromat
          </h2>

          <p style={{
            fontSize: '13px',
            color: '#64748b',
            margin: 0,
            lineHeight: '1.4'
          }}>
            บริการรับ-ส่งผ้าถึงหน้าบ้านคุณ (ซักอบ / ซักอบพับ)
          </p>
        </div>

        {/* Tab Buttons */}
        <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
          <button
            type="button"
            onClick={() => setActiveTab('terms')}
            style={{
              flex: 1,
              padding: '12px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'terms' ? '2.5px solid #1d61f2' : '2.5px solid transparent',
              fontWeight: activeTab === 'terms' ? '700' : '500',
              color: activeTab === 'terms' ? '#1d61f2' : '#64748b',
              cursor: 'pointer',
              fontSize: '13.5px'
            }}
          >
            ข้อกำหนดและเงื่อนไข
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('privacy')}
            style={{
              flex: 1,
              padding: '12px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'privacy' ? '2.5px solid #1d61f2' : '2.5px solid transparent',
              fontWeight: activeTab === 'privacy' ? '700' : '500',
              color: activeTab === 'privacy' ? '#1d61f2' : '#64748b',
              cursor: 'pointer',
              fontSize: '13.5px'
            }}
          >
            นโยบายความเป็นส่วนตัว (PDPA)
          </button>
        </div>

        {/* 2. Body */}
        <div style={{
          padding: '18px 20px',
          overflowY: 'auto',
          boxSizing: 'border-box'
        }}>
          {activeTab === 'terms' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* แถบแจ้งเตือนไฮไลท์ */}
              <div style={{
                background: '#eff6ff',
                border: '1px dashed #93c5fd',
                borderRadius: '12px',
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                color: '#1e40af',
                fontSize: '13px',
                fontWeight: '700',
                lineHeight: '1.4',
                textAlign: 'center'
              }}>
                <AlertTriangleIcon size={16} color="#1e40af" />
                <span>เพื่อการให้บริการที่ดีที่สุดและสิทธิประโยชน์ของลูกค้า กรุณาอ่านและทำความเข้าใจก่อนใช้บริการ</span>
              </div>

              {/* ข้อ 1 */}
              <div style={cardItemStyle}>
                <div style={badgeHeaderStyle}>{numberBadge(1)} การรับประกันความเสียหาย</div>
                <CheckItem>ร้านดูแลทรัพย์สินและผ้าของลูกค้าอย่างระมัดระวังที่สุด</CheckItem>
                <CheckItem>หากเกิดความเสียหายจากความผิดพลาดของทางร้าน จะชดเชยตามมูลค่าจริงโดยคำนวณจากอายุการใช้งาน สภาพสินค้า และหลักฐานการซื้อ (ถ้ามี) สูงสุดไม่เกิน 5 เท่าของค่าบริการ</CheckItem>
                <CheckItem>ร้านไม่รับผิดชอบต่อความเสียหายที่เกิดจากการเสื่อมสภาพตามอายุการใช้งานเดิมของเนื้อผ้า</CheckItem>
              </div>

              {/* ข้อ 2 */}
              <div style={cardItemStyle}>
                <div style={badgeHeaderStyle}>{numberBadge(2)} การตรวจสอบกระเป๋าเสื้อผ้าก่อนส่ง</div>
                <CheckItem>ลูกค้าต้องตรวจสอบและนำสิ่งของมีค่าออกจากกระเป๋าเสื้อผ้าทุกครั้งก่อนส่งมอบ</CheckItem>
                <CheckItem isWarning={true}><b>ทางร้านไม่รับผิดชอบ</b> ต่อเงินสด เอกสาร บัตร กุญแจ เครื่องประดับ หูฟัง โทรศัพท์ หรือของมีค่าใดๆ ที่ตกค้างอยู่ในกระเป๋า</CheckItem>
                <CheckItem>ทางร้านไม่มีมาตรการในการค้นหาหรือล้วงเสื้อผ้าลูกค้า เนื่องจากอยู่นอกเหนือกระบวนการการให้บริการ และขอบเขตความรับผิดชอบของทางร้าน</CheckItem>
              </div>

              {/* ข้อ 3 */}
              <div style={cardItemStyle}>
                <div style={badgeHeaderStyle}>{numberBadge(3)} เสื้อผ้าที่ต้องแจ้งเป็นพิเศษ</div>
                <CheckItem>ผ้าไหม</CheckItem>
                <CheckItem>หนัง</CheckItem>
                <CheckItem>ขนสัตว์</CheckItem>
                <CheckItem>ชุดราตรี</CheckItem>
                <CheckItem>สูท</CheckItem>
                <CheckItem>เสื้อผ้าแบรนด์เนม</CheckItem>
                <CheckItem>เสื้อผ้าติดเลื่อม/เพชรประดับ</CheckItem>
                <CheckItem>เสื้อผ้าที่มีป้ายกำกับ "Dry Clean Only" (ซักแห้งเท่านั้น)</CheckItem>
                <CheckItem isWarning={true}>หากส่งมาโดยไม่แจ้ง ร้านขอสงวนสิทธิ์ไม่รับผิดชอบต่อความเสียหายที่เกิดขึ้น</CheckItem>
              </div>

              {/* ข้อ 4 */}
              <div style={cardItemStyle}>
                <div style={badgeHeaderStyle}>{numberBadge(4)} คราบฝังแน่น</div>
                <CheckItem>ทางร้านพยายามซักขจัดคราบอย่างเต็มที่ตามกระบวนการซักมาตรฐาน</CheckItem>
                <CheckItem>ไม่สามารถรับประกันได้ว่าคราบฝังลึกทุกประเภทจะหลุดออกได้ 100% เพื่อหลีกเลี่ยงไม่ให้เนื้อผ้าเปื่อยหรือเสียหาย</CheckItem>
              </div>

              {/* ข้อ 5 */}
              <div style={cardItemStyle}>
                <div style={badgeHeaderStyle}>{numberBadge(5)} ปัญหาสีตกและผ้าหดตัว</div>
                <CheckItem>ร้านดำเนินการตามขั้นตอนมาตรฐาน โดยแยกผ้าขาวและผ้าสีออกจากกัน</CheckItem>
                <CheckItem>ไม่รับประกันกรณีสีตก ย้วย หรือการหดตัวจากความร้อนของการอบผ้า ซึ่งเกิดจากคุณสมบัติเฉพาะของเนื้อผ้าที่ไม่ได้มาตรฐานของผู้ผลิต</CheckItem>
              </div>

              {/* ข้อ 6 */}
              <div style={cardItemStyle}>
                <div style={badgeHeaderStyle}>{numberBadge(6)} บริการรับ-ส่งผ้า</div>
                <CheckItem>ให้บริการตามขอบเขตพื้นที่และช่วงเวลาที่ร้านกำหนด</CheckItem>
                <CheckItem>ระยะเวลารับ-ส่งจริงอาจคลาดเคลื่อนเล็กน้อยตามสภาพการจราจรและสภาพอากาศ</CheckItem>
                <CheckItem>หากพนักงานไปถึงตามนัดหมายแล้วไม่สามารถติดต่อลูกค้าได้ อาจมีค่าบริการในการจัดส่งซ้ำในรอบถัดไป</CheckItem>
              </div>

              {/* ข้อ 7 */}
              <div style={cardItemStyle}>
                <div style={badgeHeaderStyle}>{numberBadge(7)} การชำระเงิน</div>
                <CheckItem>ค่าบริการเป็นไปตามอัตราของร้าน ณ วันที่ใช้บริการ</CheckItem>
                <CheckItem>ลูกค้าควรตรวจสอบจำนวนผ้าและรายการบริการก่อนชำระเงิน</CheckItem>
                <CheckItem>ลูกค้าต้องชำระเงินตามช่องทางที่ระบบกำหนดก่อนหรือ ณ เวลาที่จัดส่งผ้าส่งมอบคืน</CheckItem>
              </div>

              {/* ข้อ 8 */}
              <div style={cardItemStyle}>
                <div style={badgeHeaderStyle}>{numberBadge(8)} สิทธิ์ในการปฏิเสธการให้บริการ</div>
                <CheckItem isWarning={true}>เสื้อผ้าหรือสิ่งของที่ปนเปื้อนสารเคมีอันตราย สารพิษ หรือเชื้อโรคขั้นรุนแรง</CheckItem>
                <CheckItem isWarning={true}>เสื้อผ้าที่อาจก่อให้เกิดอันตรายต่อเครื่องจักรหรือสุขอนามัยของพนักงาน</CheckItem>
                <CheckItem isWarning={true}>สิ่งของผิดกฎหมายทุกประเภท</CheckItem>
              </div>

              {/* ข้อ 9 */}
              <div style={cardItemStyle}>
                <div style={badgeHeaderStyle}>{numberBadge(9)} การรับเรื่องร้องเรียน</div>
                <CheckItem>กรุณาตรวจสอบความถูกต้องและแจ้งข้อร้องเรียนภายใน <b>7 วัน</b> หลังรับมอบผ้า</CheckItem>
                <CheckItem>หากพ้นกำหนด 7 วัน ทางร้านถือว่าการรับส่งมอบงานเสร็จสมบูรณ์และขอสงวนสิทธิ์ในการพิจารณาเคลมทุกกรณี</CheckItem>
              </div>
            </div>
          ) : (
            /* แท็บ PDPA */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{
                background: '#eff6ff',
                border: '1px dashed #93c5fd',
                borderRadius: '12px',
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                color: '#1e40af',
                fontSize: '13px',
                fontWeight: '700',
                lineHeight: '1.4',
                textAlign: 'center'
              }}>
                <ShieldIcon size={16} color="#1e40af" />
                <span>N&amp;N Laundromat ให้ความสำคัญและคุ้มครองข้อมูลส่วนบุคคลของท่านตามมาตรฐาน พ.ร.บ. PDPA</span>
              </div>

              {/* ข้อ 1 PDPA */}
              <div style={cardItemStyle}>
                <div style={badgeHeaderStyle}>{numberBadge(1)} ข้อมูลส่วนบุคคลที่เราเก็บรวบรวม</div>
                <CheckItem>ชื่อ - นามสกุลของผู้ใช้บริการ</CheckItem>
                <CheckItem>เบอร์โทรศัพท์สำหรับใช้ติดต่อ ติดตามสถานะงาน และรับรหัส OTP</CheckItem>
                <CheckItem>ข้อมูลที่อยู่จัดส่ง จุดปักหมุด GPS และรายละเอียดจุดรับ-ส่งผ้า</CheckItem>
                <CheckItem>ประวัติรายการสั่งบริการรับ-ส่งผ้า และหลักฐานการชำระเงิน</CheckItem>
              </div>

              {/* ข้อ 2 PDPA */}
              <div style={cardItemStyle}>
                <div style={badgeHeaderStyle}>{numberBadge(2)} วัตถุประสงค์ในการนำข้อมูลไปใช้</div>
                <CheckItem>ใช้ระบุพิกัดและเส้นทางให้พนักงานไรเดอร์เดินทางไปรับ-ส่งผ้าได้อย่างถูกต้อง</CheckItem>
                <CheckItem>ส่งข้อความแจ้งเตือนอัปเดตสถานะงานซักและรหัสยืนยันตัวตน</CheckItem>
                <CheckItem>ใช้ในการออกเอกสารใบเสร็จรับเงิน และประสานงานกรณีเกิดปัญหาเกี่ยวกับเสื้อผ้า</CheckItem>
                <CheckItem>วิเคราะห์และพัฒนาคุณภาพงานบริการให้ตอบโจทย์ลูกค้ามากยิ่งขึ้น</CheckItem>
              </div>

              {/* ข้อ 3 PDPA */}
              <div style={cardItemStyle}>
                <div style={badgeHeaderStyle}>{numberBadge(3)} มาตรการความปลอดภัยของข้อมูล</div>
                <CheckItem>ระบบจัดเก็บข้อมูลที่มีการเข้ารหัสและระบบป้องกันการเข้าถึง</CheckItem>
                <CheckItem>จำกัดการเข้าถึงข้อมูลเฉพาะพนักงานที่เกี่ยวข้องกับออเดอร์นั้นๆ เท่านั้น</CheckItem>
                <CheckItem isWarning={true}>ร้านไม่มีนโยบายจำหน่าย แลกเปลี่ยน หรือเผยแพร่ข้อมูลของลูกค้าแก่บุคคลภายนอกโดยเด็ดขาด</CheckItem>
              </div>

              {/* ข้อ 4 PDPA */}
              <div style={cardItemStyle}>
                <div style={badgeHeaderStyle}>{numberBadge(4)} สิทธิของเจ้าของข้อมูลส่วนบุคคล</div>
                <CheckItem>ลูกค้ามีสิทธิ์ขอเข้าถึง ตรวจสอบ หรือคัดลอกข้อมูลส่วนบุคคลของตนเองได้</CheckItem>
                <CheckItem>สามารถแจ้งขอแก้ไขข้อมูลส่วนตัวให้ถูกต้องและเป็นปัจจุบันได้ตลอดเวลา</CheckItem>
                <CheckItem>มีสิทธิ์ยื่นคำร้องขอลบหรือทำลายข้อมูลออกจากระบบเมื่อยกเลิกการใช้งานบัญชี</CheckItem>
              </div>

              {/* ข้อ 5 PDPA */}
              <div style={cardItemStyle}>
                <div style={badgeHeaderStyle}>{numberBadge(5)} ช่องทางการติดต่อด้านความเป็นส่วนตัว</div>
                <CheckItem>หากมีข้อสงสัยเกี่ยวกับนโยบายข้อมูลส่วนบุคคล สามารถติดต่อเจ้าหน้าที่ฝ่ายดูแลระบบได้ทาง LINE Official ของทางร้าน</CheckItem>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 20px',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '10px',
          background: '#f8fafc'
        }}>
          <button
            type="button"
            onClick={handleAgree}
            style={{
              padding: '10px 20px',
              fontSize: '13.5px',
              fontWeight: '600',
              color: '#ffffff',
              backgroundColor: '#1d61f2',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(29, 97, 242, 0.25)'
            }}
          >
            ฉันเข้าใจและยอมรับเงื่อนไข
          </button>
        </div>
      </div>
    </div>
  );
};

// --- หน้า Register หลัก (Responsive Mobile-First) ---
const RegisterPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // เงื่อนไข 1: ชื่อ-นามสกุล อนุญาตเฉพาะภาษาไทย ภาษาอังกฤษ และเว้นวรรค
    if (name === 'fullName') {
      const filteredValue = value.replace(/[^a-zA-Z\u0E00-\u0E7F\s]/g, '');
      setFormData((prev) => ({ ...prev, fullName: filteredValue }));
      return;
    }

    // เงื่อนไข 2: เบอร์โทรศัพท์ อนุญาตเฉพาะตัวเลข และไม่เกิน 10 หลัก
    if (name === 'phone') {
      const numericValue = value.replace(/\D/g, '').slice(0, 10);
      setFormData((prev) => ({ ...prev, phone: numericValue }));
      return;
    }

    // เงื่อนไข 3: รหัสผ่าน จำกัดไม่เกิน 10 ตัวอักษร
    if (name === 'password' || name === 'confirmPassword') {
      const truncatedValue = value.slice(0, 10);
      setFormData((prev) => ({ ...prev, [name]: truncatedValue }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setErrorMsg('');

    // ตรวจสอบเงื่อนไข 1: ชื่อ-นามสกุล
    const nameRegex = /^[a-zA-Z\u0E00-\u0E7F\s]+$/;
    if (!nameRegex.test(formData.fullName.trim())) {
      setErrorMsg('ชื่อ - นามสกุล ต้องเป็นภาษาไทยหรือภาษาอังกฤษเท่านั้น');
      return;
    }

    // ตรวจสอบเงื่อนไข 2: เบอร์โทรศัพท์ 10 หลักพอดี
    if (formData.phone.length !== 10) {
      setErrorMsg('เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลักเท่านั้น');
      return;
    }

    // ตรวจสอบเงื่อนไข 3: รหัสผ่าน 6 - 10 ตัวอักษร
    if (formData.password.length < 6 || formData.password.length > 10) {
      setErrorMsg('รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร และไม่เกิน 10 ตัวอักษร');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน');
      return;
    }

    if (!formData.acceptTerms) {
      setErrorMsg('กรุณายอมรับเงื่อนไขการให้บริการและนโยบายความเป็นส่วนตัว');
      return;
    }

    // บันทึกข้อมูลลง localStorage
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const isDuplicate = existingUsers.some((u) => u.phone === formData.phone);
    if (isDuplicate) {
      setErrorMsg('เบอร์โทรศัพท์นี้ถูกใช้งานแล้ว');
      return;
    }

    existingUsers.push({
      fullName: formData.fullName,
      phone: formData.phone,
      password: formData.password
    });
    localStorage.setItem('users', JSON.stringify(existingUsers));

    console.log('ข้อมูลลงทะเบียนสำเร็จ:', formData);
    alert('สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ');
    navigate('/login/customer');
  };

  return (
    <Card subtitle="สร้างบัญชีใหม่เพื่อเริ่มใช้บริการรับ-ส่งผ้า">
      <form onSubmit={handleRegister}>
        {errorMsg && (
          <div style={{
            backgroundColor: '#fef2f2',
            color: '#dc2626',
            padding: '10px 14px',
            borderRadius: '10px',
            fontSize: '13.5px',
            marginBottom: '16px',
            textAlign: 'left',
            border: '1px solid #fee2e2',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertTriangleIcon size={16} color="#dc2626" />
            <span>{errorMsg}</span>
          </div>
        )}

        <Input
          label="ชื่อ - นามสกุล"
          name="fullName"
          type="text"
          placeholder="รับส่งผ้า ซักอบพับ"
          value={formData.fullName}
          onChange={handleChange}
          required
          autoFocus
        />

        <Input
          label="เบอร์โทรศัพท์"
          name="phone"
          type="tel"
          placeholder="08XXXXXXXX"
          value={formData.phone}
          onChange={handleChange}
          required
        />

        <Input
          label="รหัสผ่าน"
          name="password"
          type="password"
          placeholder="ตั้งรหัสผ่าน 6 - 10 ตัวอักษร"
          value={formData.password}
          onChange={handleChange}
          required
          autoComplete="new-password"
        />

        <Input
          label="ยืนยันรหัสผ่าน"
          name="confirmPassword"
          type="password"
          placeholder="กรอกรหัสผ่านอีกครั้ง"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          autoComplete="new-password"
        />

        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '10px',
          textAlign: 'left',
          marginTop: '6px',
          marginBottom: '20px',
          paddingLeft: '2px'
        }}>
          <input
            type="checkbox"
            id="terms"
            name="acceptTerms"
            checked={formData.acceptTerms}
            onChange={handleChange}
            style={{
              width: '18px',
              height: '18px',
              marginTop: '2px',
              accentColor: '#1d61f2',
              cursor: 'pointer'
            }}
          />
          <label htmlFor="terms" style={{ fontSize: '13px', color: '#4b5563', lineHeight: '1.4', cursor: 'pointer' }}>
            ฉันยอมรับ{' '}
            <span
              onClick={(e) => {
                e.preventDefault();
                setIsTermsOpen(true);
              }}
              style={{ color: '#1d61f2', textDecoration: 'underline', fontWeight: '600', cursor: 'pointer' }}
            >
              เงื่อนไขการให้บริการและนโยบายความเป็นส่วนตัว
            </span>
          </label>
        </div>

        <Button type="submit">สมัครสมาชิก</Button>

        <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '22px', marginBottom: 0 }}>
          มีบัญชีอยู่แล้วใช่หรือไม่?{' '}
          <a
            href="/login/customer"
            onClick={(e) => {
              e.preventDefault();
              navigate('/login/customer');
            }}
            style={{ color: '#1d61f2', textDecoration: 'none', fontWeight: '600', marginLeft: '4px' }}
          >
            เข้าสู่ระบบ
          </a>
        </p>
      </form>

      <TermsModal
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
        onAccept={() => {
          setFormData((prev) => ({ ...prev, acceptTerms: true }));
          setErrorMsg('');
        }}
      />
    </Card>
  );
};

export default RegisterPage;