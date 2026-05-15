'use client';

import { useState, useRef } from 'react';
import * as bcrypt from 'bcryptjs';
import { KeyRound, AlertTriangle } from 'lucide-react';

// Import validation functions
import {
  validatePassword,
  validateOTP,
  validateEmail,
  validateUsername,
} from '@/lib/validations';

// Import Components (Hãy kiểm tra lại đường dẫn xem đã khớp với dự án của bạn chưa nhé)
import FullScreenLoader from '@/components/register/FullScreenLoader'; 
import StepIndicator from '@/components/register/StepIndicator';       
import Step1Identify from '@/components/forgot-password/Step1Identify';
import Step2VerifyOTP from '@/components/forgot-password/Step2VerifyOTP';
import Step3ResetPassword from '@/components/forgot-password/Step3ResetPassword';
import SuccessScreen from '@/components/forgot-password/SuccessScreen';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const resolvedEmail = useRef('');
  const resolvedUsername = useRef('');

  const goTransition = (nextStep: 1 | 2 | 3) => {
    setTransitioning(true);
    setTimeout(() => { setTransitioning(false); setStep(nextStep); }, 800);
  };

  const startCooldown = () => {
    setResendCooldown(60);
    const interval = setInterval(() => {
      setResendCooldown(prev => { if (prev <= 1) { clearInterval(interval); return 0; } return prev - 1; });
    }, 1000);
  };

  // ── Bước 1: Nhập username hoặc email → Gửi OTP về email ──
  const handleStep1 = async () => {
    setError('');
    if (!usernameOrEmail.trim()) {
      setError('Vui lòng nhập username hoặc email'); 
      return;
    }

    // Check if it's email format or username
    const isEmail = usernameOrEmail.includes('@');
    if (isEmail) {
      const emailValidation = validateEmail(usernameOrEmail);
      if (!emailValidation.valid) {
        setError(emailValidation.error!);
        return;
      }
    } else {
      const usernameValidation = validateUsername(usernameOrEmail);
      if (!usernameValidation.valid) {
        setError(usernameValidation.error!);
        return;
      }
    }

    setLoading(true);
    try {
      const res = await fetch('https://myposapi.onrender.com/api/auth/forgot-password/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usernameOrEmail }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'Có lỗi xảy ra'); setLoading(false); return; }

      resolvedEmail.current = data.email || usernameOrEmail;
      resolvedUsername.current = data.username || usernameOrEmail;
      startCooldown();
      setLoading(false);
      goTransition(2);
    } catch {
      setError('Không thể kết nối server'); setLoading(false);
    }
  };

  // ── Bước 2: Xác nhận OTP → gọi API kiểm tra trước khi qua bước 3 ──
  const handleStep2 = async () => {
    setError('');
    
    const otpValidation = validateOTP(otpCode);
    if (!otpValidation.valid) {
      setError(otpValidation.error!);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('https://myposapi.onrender.com/api/auth/forgot-password/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: resolvedUsername.current,
          email: resolvedEmail.current,
          otpCode,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'OTP không hợp lệ'); setLoading(false); return; }
      setLoading(false);
      goTransition(3);
    } catch {
      setError('Không thể kết nối server'); setLoading(false);
    }
  };

  // ── Bước 3: Nhập mật khẩu mới ──
  const handleStep3 = async () => {
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

    setLoading(true);
    try {
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      const res = await fetch('https://myposapi.onrender.com/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: resolvedUsername.current,
          email: resolvedEmail.current,
          otpCode,
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

  const stepTitles = ['Tìm tài khoản', 'Nhập mã OTP', 'Đặt mật khẩu mới'];
  const stepDescs = [
    'Nhập username hoặc email của tài khoản',
    `Nhập mã OTP đã gửi đến email của bạn`,
    'Nhập mật khẩu mới cho tài khoản',
  ];

  return (
    <div style={{
      minHeight: '100vh', background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '24px 16px', fontFamily: 'sans-serif',
    }}>
      {transitioning && <FullScreenLoader text="Đang xử lý..." />}

      <button onClick={() => window.location.href = '/home'} style={{
        position: 'fixed', top: '20px', left: '20px', background: 'white', border: '2px solid #DBEAFE',
        borderRadius: '12px', padding: '8px 16px', color: '#2563EB', fontWeight: '600', cursor: 'pointer',
      }}>← Trang chủ</button>

      <div style={{
        background: 'white', borderRadius: '24px', padding: '40px', width: '100%', maxWidth: '480px',
        boxShadow: '0 24px 64px rgba(37,99,235,0.15)',
      }}>
        {success ? <SuccessScreen /> : (
          <>
            {/* Header Icon & Title */}
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <div style={{
                width: '64px', height: '64px', margin: '0 auto 12px', background: 'linear-gradient(135deg, #2563EB, #3B82F6)',
                borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}><KeyRound size={32} color="white" /></div>
              <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#0F1419', margin: 0 }}>{stepTitles[step - 1]}</h1>
              <p style={{ color: '#6B7280', fontSize: '14px', marginTop: '6px' }}>{stepDescs[step - 1]}</p>
            </div>

            {/* Gọi Component StepIndicator bạn đã viết */}
            <StepIndicator step={step} r={{ step: "Bước" }} />

            {error && (
              <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '10px', padding: '12px 16px', color: '#DC2626', fontSize: '14px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle size={16} />{error}
              </div>
            )}

            {step === 1 && <Step1Identify usernameOrEmail={usernameOrEmail} setUsernameOrEmail={setUsernameOrEmail} onNext={handleStep1} loading={loading} />}
            
            {step === 2 && <Step2VerifyOTP otpCode={otpCode} setOtpCode={setOtpCode} onNext={handleStep2} onBack={() => { setStep(1); setError(''); }} resendOTP={handleStep1} resendCooldown={resendCooldown} loading={loading} />}
            
            {step === 3 && <Step3ResetPassword newPassword={newPassword} setNewPassword={setNewPassword} confirmPassword={confirmPassword} setConfirmPassword={setConfirmPassword} onNext={handleStep3} onBack={() => { setStep(2); setError(''); }} loading={loading} />}
          </>
        )}
      </div>
    </div>
  );
}