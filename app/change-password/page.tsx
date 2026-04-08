'use client';

import { useState } from 'react';
import * as bcrypt from 'bcryptjs';
import { KeyRound, CheckCircle, AlertTriangle } from 'lucide-react';

// Import validation functions
import {
  validatePassword,
} from '@/lib/validations';

// Import các Components (Điều chỉnh đường dẫn cho phù hợp thư mục của bạn)
import FullScreenLoader from '@/components/register/FullScreenLoader';
import StepIndicator from '@/components/register/StepIndicator';
import Step1Verify from '@/components/change-password/Step1Verify';
import Step2Change from '@/components/change-password/Step2Change';

export default function ChangePasswordPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // States lưu dữ liệu nhập
  const [username, setUsername] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const goTransition = (nextStep: 1 | 2) => {
    setTransitioning(true);
    setTimeout(() => { setTransitioning(false); setStep(nextStep); }, 800);
  };

  // ── Bước 1: Nhập username + mật khẩu cũ → xác nhận ──
  const handleStep1 = async () => {
    setError('');
    if (!username || !oldPassword) {
      setError('Vui lòng nhập đầy đủ thông tin'); return;
    }
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3001/api/auth/verify-old-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, oldPassword }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'Có lỗi xảy ra'); setLoading(false); return; }
      setLoading(false);
      goTransition(2);
    } catch {
      setError('Không thể kết nối server'); setLoading(false);
    }
  };

  // ── Bước 2: Nhập mật khẩu mới + xác nhận → đổi thành công ──
  const handleStep2 = async () => {
    setError('');
    if (!newPassword || !confirmPassword) {
      setError('Vui lòng nhập đầy đủ thông tin'); 
      return;
    }

    // Validate password
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.valid) {
      setError(passwordValidation.errors.join('\n'));
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp'); 
      return;
    }
    if (oldPassword === newPassword) {
      setError('Mật khẩu mới không được trùng với mật khẩu cũ'); 
      return;
    }
    setLoading(true);
    try {
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      const res = await fetch('http://localhost:3001/api/auth/change-password-direct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          oldPassword,
          newPassword: hashedNewPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'Có lỗi xảy ra'); setLoading(false); return; }
      setLoading(false);
      setSuccess(true);
      setTimeout(() => { window.location.href = '/home'; }, 2000);
    } catch {
      setError('Không thể kết nối server'); setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '24px 16px', fontFamily: 'sans-serif',
    }}>

      {transitioning && <FullScreenLoader text="Đang xử lý..." />}

      <button onClick={() => window.location.href = '/home'} style={{
        position: 'fixed', top: '20px', left: '20px', background: 'white', border: '2px solid #DBEAFE',
        borderRadius: '12px', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px',
        cursor: 'pointer', fontSize: '14px', fontWeight: '600', color: '#2563EB',
        boxShadow: '0 2px 8px rgba(37,99,235,0.15)', transition: 'all 0.2s ease', zIndex: 100,
      }}>
        ← Trang chủ
      </button>

      <div style={{
        background: 'white', borderRadius: '24px', padding: '40px', width: '100%', maxWidth: '480px',
        boxShadow: '0 24px 64px rgba(37,99,235,0.15)',
      }}>

        {success ? (
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
              Đổi mật khẩu thành công!
            </h2>
            <p style={{ color: '#6B7280', fontSize: '14px' }}>Đang chuyển về trang chủ...</p>
          </div>
        ) : (
          <>
            {/* Header Icon & Title */}
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <div style={{
                width: '64px', height: '64px', margin: '0 auto 12px', background: 'linear-gradient(135deg, #2563EB, #3B82F6)',
                borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(37,99,235,0.35)',
              }}>
                <KeyRound size={32} color="white" />
              </div>
              <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#0F1419', margin: 0 }}>
                {step === 1 ? 'Xác minh tài khoản' : 'Đặt mật khẩu mới'}
              </h1>
              <p style={{ color: '#6B7280', fontSize: '14px', marginTop: '6px' }}>
                {step === 1 ? 'Nhập username và mật khẩu cũ để xác minh' : 'Nhập mật khẩu mới cho tài khoản của bạn'}
              </p>
            </div>

            {/* Gọi Component StepIndicator (Lưu ý: Component này đang map 3 bước, bạn có thể truyền thêm mảng số bước hoặc chỉ hiện Bước 1, 2) */}
            <StepIndicator step={step} r={{ step: "Bước" }} /> 

            {error && (
              <div style={{
                background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '10px', padding: '12px 16px',
                color: '#DC2626', fontSize: '14px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px',
              }}>
                <AlertTriangle size={16} />{error}
              </div>
            )}

            {/* Render nội dung Form tương ứng */}
            {step === 1 && (
              <Step1Verify 
                username={username} setUsername={setUsername} 
                oldPassword={oldPassword} setOldPassword={setOldPassword} 
                onNext={handleStep1} loading={loading} 
              />
            )}

            {step === 2 && (
              <Step2Change 
                newPassword={newPassword} setNewPassword={setNewPassword} 
                confirmPassword={confirmPassword} setConfirmPassword={setConfirmPassword} 
                onNext={handleStep2} onBack={() => { setStep(1); setError(''); }} loading={loading} 
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}