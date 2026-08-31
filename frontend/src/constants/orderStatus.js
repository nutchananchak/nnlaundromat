import { Clock, Bike, PackageCheck, Shirt, CreditCard, Truck, CheckCircle2 } from 'lucide-react';

export const ORDER_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  PICKED_UP: 'picked_up',
  WASHING: 'washing',
  AWAITING_PAYMENT: 'awaiting_payment',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  COMPLETED: 'completed',
};

export const ORDER_STEPS = [
  { status: ORDER_STATUS.PENDING, label: 'รอรับงาน', icon: Clock },
  { status: ORDER_STATUS.ACCEPTED, label: 'กำลังมารับ', icon: Bike },
  { status: ORDER_STATUS.PICKED_UP, label: 'รับผ้าแล้ว นำส่งร้าน', icon: PackageCheck },
  { status: ORDER_STATUS.WASHING, label: 'กำลังซักอบ', icon: Shirt },
  { status: ORDER_STATUS.AWAITING_PAYMENT, label: 'ดำเนินงานเสร็จแล้ว', icon: CreditCard },
  { status: ORDER_STATUS.OUT_FOR_DELIVERY, label: 'อยู่ระหว่าง ส่งคืนผ้า', icon: Truck },
  { status: ORDER_STATUS.COMPLETED, label: 'ส่งคืนผ้าสำเร็จ', icon: CheckCircle2 },
];