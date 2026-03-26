'use client';
import { useState } from 'react';

export default function SuperAdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) { setError('Vui lòng nhập đầy đủ!'); return; }
    setLoading(true); setError('');
    try {
      const res = await fetch(
        `http://localhost:3001/api/auth/login/${encodeURIComponent(username)}/${encodeURIComponent(password)}`
      );
      const data = await res.json();
      if (!res.ok || !data.access_token) {
        setError(data.message || 'Sai tài khoản hoặc mật khẩu!'); return;
      }
      const payload = JSON.parse(atob(data.access_token.split('.')[1]));
      if (payload.role !== 'superadmin') {
        setError('Bạn không có quyền truy cập!'); return;
      }
      localStorage.setItem('superadmin_token', data.access_token);
      window.location.href = '/dashboard';
    } catch {
      setError('Không thể kết nối server!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px',
    }}>
      {/* Nút về home */}
      <button onClick={() => window.location.href = '/home'} style={{
        position: 'fixed', top: '20px', left: '20px',
        background: 'rgba(255,255,255,0.1)', border: '1px solid #334155',
        borderRadius: '12px', padding: '8px 16px',
        display: 'flex', alignItems: 'center', gap: '8px',
        cursor: 'pointer', fontSize: '14px', fontWeight: '600',
        color: '#94A3B8', transition: 'all 0.2s ease', zIndex: 100,
      }}
        onMouseEnter={e => (e.currentTarget.style.transform = 'translateX(-3px)')}
        onMouseLeave={e => (e.currentTarget.style.transform = 'translateX(0)')}
      >
        ← Trang chủ
      </button>

      <div style={{
        background: '#1E293B', borderRadius: '24px',
        padding: '48px 40px', width: '100%', maxWidth: '420px',
        boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
        border: '1px solid #334155',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{
            width: '64px', height: '64px', margin: '0 auto 16px',
            background: 'linear-gradient(135deg, #DC2626, #EF4444)',
            borderRadius: '16px', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            fontSize: '28px', boxShadow: '0 8px 24px rgba(220,38,38,0.4)',
          }}>🛡️</div>
          <h1 style={{ fontSize: '22px', fontWeight: '800', color: 'white', margin: 0 }}>
            Super Admin
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '14px', marginTop: '6px' }}>
            Hệ thống quản trị myPOS
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: 'rgba(220,38,38,0.1)', border: '1px solid #DC2626',
            borderRadius: '10px', padding: '12px 16px',
            color: '#FCA5A5', fontSize: '14px', marginBottom: '20px',
          }}>⚠️ {error}</div>
        )}

        {/* Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#94A3B8', marginBottom: '8px' }}>
              Tên đăng nhập
            </label>
            <input
              value={username}
              onChange={e => setUsername(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              placeholder="superadmin"
              style={{
                width: '100%', padding: '12px 16px',
                background: '#0F172A', border: '1px solid #334155',
                borderRadius: '10px', color: 'white', fontSize: '15px',
                outline: 'none', boxSizing: 'border-box',
              }}
              onFocus={e => (e.target.style.borderColor = '#DC2626')}
              onBlur={e => (e.target.style.borderColor = '#334155')}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#94A3B8', marginBottom: '8px' }}>
              Mật khẩu
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                placeholder="••••••••"
                style={{
                  width: '100%', padding: '12px 44px 12px 16px',
                  background: '#0F172A', border: '1px solid #334155',
                  borderRadius: '10px', color: 'white', fontSize: '15px',
                  outline: 'none', boxSizing: 'border-box',
                }}
                onFocus={e => (e.target.style.borderColor = '#DC2626')}
                onBlur={e => (e.target.style.borderColor = '#334155')}
              />
              <button onClick={() => setShowPass(!showPass)} style={{
                position: 'absolute', right: '12px', top: '50%',
                transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px',
              }}>{showPass ? '🙈' : '👁️'}</button>
            </div>
          </div>

          <button onClick={handleLogin} disabled={loading} style={{
            width: '100%', padding: '14px',
            background: loading ? '#7F1D1D' : 'linear-gradient(135deg, #DC2626, #EF4444)',
            color: 'white', border: 'none', borderRadius: '12px',
            fontSize: '16px', fontWeight: '700',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginTop: '8px', boxShadow: '0 8px 24px rgba(220,38,38,0.3)',
          }}>
            {loading ? '⏳ Đang xác thực...' : '🔐 Đăng nhập'}
          </button>
        </div>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '12px', color: '#475569' }}>
          Chỉ dành cho quản trị viên hệ thống
        </p>
      </div>
    </div>
  );
}