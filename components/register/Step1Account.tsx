'use client';

import { useState, useEffect } from 'react';
import { Mail } from 'lucide-react';
import AuthInput from './AuthInput';

export default function Step1Account({ data, setData, onNext, loading, r }: any) {
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Load Google Identity Services script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  const handleGoogleRegister = () => {
    const google = (window as any).google;
    if (!google) return alert('Google chưa tải xong, thử lại!');

    const container = document.getElementById('google-btn-hidden');
    if (!container) return;

    google.accounts.id.initialize({
      client_id: '111214843801-g89e5otcfiqfob9sev9r8kba7fg58vll.apps.googleusercontent.com',
      callback: async (response: any) => {
        try {
          //  Xóa email cũ trước khi lưu cái mới
          localStorage.removeItem('google_email');

          const res = await fetch('http://localhost:3001/api/auth/google/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              idToken: response.credential,
              mode: 'register',
            }),
          });
          const data = await res.json();
          if (!res.ok) { alert(data.message || 'Lỗi đăng ký Google!'); return; }

          localStorage.setItem('token', data.access_token);

          //  Giải mã idToken để lấy email và lưu vào localStorage
          const payload = JSON.parse(atob(response.credential.split('.')[1]));
          localStorage.setItem('google_email', payload.email);

          window.location.href = '/register?step=3&provider=google';
        } catch {
          alert('Lỗi kết nối server!');
        }
      },
      ux_mode: 'popup',
    });

    google.accounts.id.renderButton(container, {
      type: 'standard',
      theme: 'outline',
      size: 'large',
    });

    const btn = container.querySelector('div[role=button]') as HTMLElement;
    if (btn) btn.click();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <AuthInput label={`${r.fullName} *`} placeholder={r.fullNamePh} value={data.fullName} onChange={(e: any) => setData({...data, fullName: e.target.value})} />
      <AuthInput label={`${r.username} *`} placeholder={r.usernamePh} value={data.username} onChange={(e: any) => setData({...data, username: e.target.value})} />
      <AuthInput label={`${r.email} *`} type="email" placeholder="email@example.com" value={data.email} onChange={(e: any) => setData({...data, email: e.target.value})} />
      <AuthInput label={r.phone} placeholder="0901234567" maxLength={10} value={data.phone} onChange={(e: any) => setData({...data, phone: e.target.value.replace(/\D/g, '').slice(0, 10)})} />
      <AuthInput label={`${r.password} *`} type={showPass ? 'text' : 'password'} placeholder={r.passwordPh} value={data.password} onChange={(e: any) => setData({...data, password: e.target.value})} showPassBtn showPass={showPass} onTogglePass={() => setShowPass(!showPass)} />
      <AuthInput label={`${r.confirmPassword} *`} type={showConfirm ? 'text' : 'password'} placeholder={r.confirmPasswordPh} value={data.confirmPassword} onChange={(e: any) => setData({...data, confirmPassword: e.target.value})} showPassBtn showPass={showConfirm} onTogglePass={() => setShowConfirm(!showConfirm)} />

      <button onClick={onNext} disabled={loading} style={{
        width: '100%', padding: '14px',
        background: loading ? '#C7D2FE' : 'linear-gradient(135deg, #2563EB, #3B82F6)',
        color: 'white', border: 'none', borderRadius: '12px',
        fontSize: '16px', fontWeight: '700',
        cursor: loading ? 'not-allowed' : 'pointer',
        marginTop: '8px', boxShadow: '0 8px 24px rgba(37,99,235,0.3)',
      }}>
        {loading ? r.processing : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <Mail size={16} />Tiếp theo & gửi mã OTP
          </div>
        )}
      </button>

      <div style={{ display: 'flex', alignItems: 'center', margin: '10px 0' }}>
        <div style={{ flex: 1, height: '1px', background: '#E5E7EB' }}></div>
        <span style={{ padding: '0 10px', color: '#9CA3AF', fontSize: '12px', fontWeight: 600 }}>HOẶC</span>
        <div style={{ flex: 1, height: '1px', background: '#E5E7EB' }}></div>
      </div>

      <button
        type="button"
        onClick={handleGoogleRegister}
        disabled={loading}
        style={{
          width: '100%', display: 'flex', alignItems: 'center',
          justifyContent: 'center', gap: '12px', padding: '12px',
          background: 'white', border: '1px solid #E5E7EB',
          borderRadius: '12px', cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: '15px', fontWeight: '600', color: '#374151',
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
        }}
        onMouseOver={(e) => (e.currentTarget.style.background = '#F9FAFB')}
        onMouseOut={(e) => (e.currentTarget.style.background = 'white')}
      >
        <img
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
          alt="Google"
          style={{ width: '20px', height: '20px' }}
        />
        Đăng ký nhanh bằng Google
      </button>
      <div id="google-btn-hidden" style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}></div>
    </div>
  );
}