'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function GoogleCallbackHandler() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const shopSetupDone = searchParams.get('shopSetupDone');
    const mode = searchParams.get('mode');
    const error = searchParams.get('error');

    // Xử lý lỗi
    if (error === 'email_exists') {
      alert('Email này đã được đăng ký! Vui lòng đăng nhập.');
      window.location.href = '/login';
      return;
    }
    if (error === 'not_registered') {
      alert('Chưa có tài khoản! Vui lòng đăng ký trước.');
      window.location.href = '/register';
      return;
    }

    // Xử lý thành công
    if (token) {
      localStorage.setItem('token', token);

      if (mode === 'register' || shopSetupDone === 'false') {
        // Đăng ký Google xong → vào Step 3 điền thông tin shop
        window.location.href = '/register?step=3&provider=google';
      } else {
        // Đăng nhập xong → vào dashboard
        window.location.href = '/dashboard';
      }
    }
  }, [searchParams]);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: '16px',
      fontFamily: 'sans-serif',
      background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
    }}>
      <div style={{
        width: '48px',
        height: '48px',
        border: '4px solid #DBEAFE',
        borderTop: '4px solid #2563EB',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
      }} />
      <p style={{ color: '#6B7280', fontSize: '16px', fontWeight: 500 }}>
        Đang xử lý đăng nhập Google...
      </p>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={<div>Đang tải...</div>}>
      <GoogleCallbackHandler />
    </Suspense>
  );
}