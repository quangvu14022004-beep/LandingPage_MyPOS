import { CheckCircle } from 'lucide-react';

export default function SuccessScreen() {
  return (
    <div style={{ textAlign: 'center', padding: '20px 0' }}>
      <div style={{
        width: '80px', height: '80px', margin: '0 auto 20px',
        background: 'linear-gradient(135deg, #00A854, #00C853)',
        borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 8px 24px rgba(0,168,84,0.35)',
      }}>
        <CheckCircle size={40} color="white" />
      </div>
      <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#0F1419', marginBottom: '8px' }}>
        Đặt lại mật khẩu thành công!
      </h2>
      <p style={{ color: '#6B7280', fontSize: '14px' }}>Đang chuyển về trang chủ...</p>
    </div>
  );
}