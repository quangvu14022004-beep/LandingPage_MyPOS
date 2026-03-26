import { useState } from 'react';
import { Mail } from 'lucide-react';
import AuthInput from './AuthInput';

export default function Step1Account({ data, setData, onNext, loading, r }: any) {
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <AuthInput label={`${r.fullName} *`} placeholder={r.fullNamePh} value={data.fullName} onChange={e => setData({...data, fullName: e.target.value})} />
      <AuthInput label={`${r.username} *`} placeholder={r.usernamePh} value={data.username} onChange={e => setData({...data, username: e.target.value})} />
      <AuthInput label={`${r.email} *`} type="email" placeholder="email@example.com" value={data.email} onChange={e => setData({...data, email: e.target.value})} />
      <AuthInput label={r.phone} placeholder="0901234567" maxLength={10} value={data.phone} onChange={e => setData({...data, phone: e.target.value.replace(/\D/g, '').slice(0, 10)})} />
      
      <AuthInput label={`${r.password} *`} type={showPass ? 'text' : 'password'} placeholder={r.passwordPh} value={data.password} onChange={e => setData({...data, password: e.target.value})} showPassBtn showPass={showPass} onTogglePass={() => setShowPass(!showPass)} />
      <AuthInput label={`${r.confirmPassword} *`} type={showConfirm ? 'text' : 'password'} placeholder={r.confirmPasswordPh} value={data.confirmPassword} onChange={e => setData({...data, confirmPassword: e.target.value})} showPassBtn showPass={showConfirm} onTogglePass={() => setShowConfirm(!showConfirm)} />

      <button onClick={onNext} disabled={loading} style={{
        width: '100%', padding: '14px', background: loading ? '#C7D2FE' : 'linear-gradient(135deg, #2563EB, #3B82F6)',
        color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '8px', boxShadow: '0 8px 24px rgba(37,99,235,0.3)',
      }}>
        {loading ? r.processing : <><Mail size={16} style={{ marginRight: '8px' }} />Tiếp theo & gửi mã OTP</>}
      </button>
    </div>
  );
}