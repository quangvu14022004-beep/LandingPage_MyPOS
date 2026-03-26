import { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';
import AuthInput from '../register/AuthInput'; // Đảm bảo đường dẫn đúng tới file AuthInput của bạn

export default function Step1Verify({ username, setUsername, oldPassword, setOldPassword, onNext, loading }: any) {
  const [showOldPass, setShowOldPass] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <AuthInput 
        label="Tên đăng nhập *" 
        placeholder="Nhập username"
        value={username} 
        onChange={(e: any) => setUsername(e.target.value)}
      />
      
      <AuthInput 
        label="Mật khẩu cũ *" 
        type={showOldPass ? 'text' : 'password'}
        placeholder="Nhập mật khẩu cũ"
        value={oldPassword} 
        onChange={(e: any) => setOldPassword(e.target.value)}
        onKeyDown={(e: any) => e.key === 'Enter' && onNext()}
        showPassBtn 
        showPass={showOldPass} 
        onTogglePass={() => setShowOldPass(!showOldPass)}
      />

      <button onClick={onNext} disabled={loading} style={{
        width: '100%', padding: '14px',
        background: loading ? '#C7D2FE' : 'linear-gradient(135deg, #2563EB, #3B82F6)',
        color: 'white', border: 'none', borderRadius: '12px',
        fontSize: '16px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer',
        marginTop: '8px', boxShadow: '0 8px 24px rgba(37,99,235,0.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
      }}>
        {loading ? 'Đang xử lý...' : <><CheckCircle size={16} />Xác nhận</>}
      </button>

      {/* Link quên mật khẩu */}
      <p style={{ textAlign: 'center', fontSize: '13px', color: '#6B7280', marginTop: '4px' }}>
        Quên mật khẩu?{' '}
        <Link href="/forgot-password" style={{ color: '#2563EB', fontWeight: '600', textDecoration: 'none' }}>
          Khôi phục tại đây
        </Link>
      </p>
    </div>
  );
}