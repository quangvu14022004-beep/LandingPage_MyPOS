import { Mail } from 'lucide-react';
import AuthInput from '../register/AuthInput'; // Import từ folder cũ hoặc folder ui của bạn

export default function Step1Identify({ usernameOrEmail, setUsernameOrEmail, onNext, loading }: any) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <AuthInput 
        label="Username hoặc Email *" 
        placeholder="Nhập username hoặc email"
        value={usernameOrEmail}
        onChange={(e: any) => setUsernameOrEmail(e.target.value)}
        onKeyDown={(e: any) => e.key === 'Enter' && onNext()}
      />
      <button onClick={onNext} disabled={loading} style={{
        width: '100%', padding: '14px',
        background: loading ? '#C7D2FE' : 'linear-gradient(135deg, #2563EB, #3B82F6)',
        color: 'white', border: 'none', borderRadius: '12px',
        fontSize: '16px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer',
        marginTop: '8px', boxShadow: '0 8px 24px rgba(37,99,235,0.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
      }}>
        {loading ? 'Đang xử lý...' : <><Mail size={16} />Gửi mã OTP</>}
      </button>
    </div>
  );
}