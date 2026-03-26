import { useState } from 'react';
import { KeyRound } from 'lucide-react';
import AuthInput from '../register/AuthInput'; // Đảm bảo đường dẫn đúng

export default function Step2Change({ newPassword, setNewPassword, confirmPassword, setConfirmPassword, onNext, onBack, loading }: any) {
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <AuthInput 
        label="Mật khẩu mới *" 
        type={showNewPass ? 'text' : 'password'}
        placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
        value={newPassword} 
        onChange={(e: any) => setNewPassword(e.target.value)}
        showPassBtn 
        showPass={showNewPass} 
        onTogglePass={() => setShowNewPass(!showNewPass)}
      />

      <AuthInput 
        label="Xác nhận mật khẩu mới *" 
        type={showConfirmPass ? 'text' : 'password'}
        placeholder="Nhập lại mật khẩu mới"
        value={confirmPassword} 
        onChange={(e: any) => setConfirmPassword(e.target.value)}
        onKeyDown={(e: any) => e.key === 'Enter' && onNext()}
        showPassBtn 
        showPass={showConfirmPass} 
        onTogglePass={() => setShowConfirmPass(!showConfirmPass)}
      />

      <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
        <button onClick={onBack} style={{
          flex: 1, padding: '14px', background: 'white', color: '#2563EB',
          border: '2px solid #2563EB', borderRadius: '12px',
          fontSize: '15px', fontWeight: '700', cursor: 'pointer',
        }}>← Quay lại</button>

        <button onClick={onNext} disabled={loading} style={{
          flex: 2, padding: '14px',
          background: loading ? '#C7D2FE' : 'linear-gradient(135deg, #2563EB, #3B82F6)',
          color: 'white', border: 'none', borderRadius: '12px',
          fontSize: '15px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer',
          boxShadow: '0 8px 24px rgba(37,99,235,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
        }}>
          {loading ? 'Đang xử lý...' : <><KeyRound size={16} />Đổi mật khẩu</>}
        </button>
      </div>
    </div>
  );
}