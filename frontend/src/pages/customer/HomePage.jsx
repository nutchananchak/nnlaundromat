import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';
import BottomNav from '../../components/layout/BottomNav';

export default function HomePage() {
  return (
    <div className="p-4 pb-20">
      <h1 className="text-2xl font-bold mb-4">ทดสอบ Components</h1>
      
      <Card className="mb-4">
        <p>นี่คือ Card component</p>
      </Card>

      <Input label="ชื่อทดสอบ" placeholder="กรอกชื่อ" />
      
      <Button onClick={() => alert('คลิกแล้ว')}>
        ปุ่มทดสอบ
      </Button>

      <BottomNav />
    </div>
  );
}