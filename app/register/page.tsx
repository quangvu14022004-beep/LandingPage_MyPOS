'use client';

import { useState, useRef, useEffect } from 'react';
import { useLang } from '@/lib/LanguageContext';
import * as bcrypt from 'bcryptjs';
import { AlertTriangle } from 'lucide-react';

// Import validation functions
import {
  validateEmail,
  validatePhone,
  validatePassword,
  validateUsername,
  validateFullName,
  validateOTP,
  validateAddress,
} from '@/lib/validations';

// Import Component đã tách
import FullScreenLoader from '@/components/register/FullScreenLoader';
import StepIndicator from '@/components/register/StepIndicator';
import Step1Account from '@/components/register/Step1Account';
import Step2OTP from '@/components/register/Step2_OTP';
import Step3ShopSetup from '@/components/register/Step3ShopSetup';

// Types & Data
type Step1Data = { username: string; password: string; confirmPassword: string; fullName: string; email: string; phone: string; };
type Step2Data = { otpCode: string; };
type Step3Data = { name: string; ownerName: string; phone: string; email: string; address: string; city: string; country: string; businessType: string; taxCode: string; };

const CITIES = [
  // 6 Thành phố trực thuộc Trung ương
  'Hà Nội',
  'TP. Hồ Chí Minh',  // + Bình Dương + Bà Rịa - Vũng Tàu
  'Hải Phòng',         // + Hải Dương
  'Đà Nẵng',           // + Quảng Nam
  'Cần Thơ',           // + Sóc Trăng + Hậu Giang
  'Huế',               // giữ nguyên

  // 28 Tỉnh
  'Tuyên Quang',       // + Hà Giang
  'Lào Cai',           // + Yên Bái
  'Thái Nguyên',       // + Bắc Kạn
  'Phú Thọ',           // + Vĩnh Phúc + Hòa Bình
  'Bắc Ninh',          // + Bắc Giang
  'Hưng Yên',          // + Thái Bình
  'Ninh Bình',         // + Hà Nam + Nam Định
  'Quảng Trị',         // + Quảng Bình
  'Quảng Ngãi',        // + Kon Tum
  'Gia Lai',           // + Bình Định
  'Khánh Hòa',         // + Ninh Thuận
  'Lâm Đồng',          // + Đắk Nông + Bình Thuận
  'Đắk Lắk',           // + Phú Yên
  'Đồng Nai',          // + Bình Phước
  'Tây Ninh',          // + Long An
  'Vĩnh Long',         // + Bến Tre + Trà Vinh
  'Đồng Tháp',         // + Tiền Giang
  'Cà Mau',            // + Bạc Liêu
  'An Giang',          // + Kiên Giang

  // Giữ nguyên
  'Cao Bằng',
  'Lai Châu',
  'Điện Biên',
  'Sơn La',
  'Lạng Sơn',
  'Quảng Ninh',
  'Thanh Hóa',
  'Nghệ An',
  'Hà Tĩnh',
];

export default function RegisterPage() {
  const { lang, setLang, t } = useLang();
  const r = t.register;
  
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [businessTypes, setBusinessTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [error, setError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  
  // Track completed steps for sequential validation
  const [completedSteps, setCompletedSteps] = useState<{ step1: boolean; step2: boolean }>({ step1: false, step2: false });

  const verifiedTokenRef = useRef<string>('');
  const accessTokenRef = useRef<string>('');

  const [step1, setStep1] = useState<Step1Data>({ username: '', password: '', confirmPassword: '', fullName: '', email: '', phone: '' });
  const [step2, setStep2] = useState<Step2Data>({ otpCode: '' });
  const [hasLodging, setHasLodging] = useState(false);
  const [hasSales, setHasSales] = useState(false);
  const [step3, setStep3] = useState<Step3Data>({ name: '', ownerName: '', phone: '', email: '', address: '', city: '', country: 'Việt Nam', businessType: '', taxCode: '' });

  // Load cache
  useEffect(() => {
    const raw = localStorage.getItem('register_step1');
    if (raw) { try { setStep1(JSON.parse(raw)); setCompletedSteps(prev => ({ ...prev, step1: true })); } catch (e) { console.error(e); } }
    
    // Load completed steps from localStorage
    const completedRaw = localStorage.getItem('register_completed_steps');
    if (completedRaw) { 
      try { 
        setCompletedSteps(JSON.parse(completedRaw)); 
      } catch (e) { console.error(e); } 
    }
  }, []);
  // Fetch danh sách businessTypes từ API
useEffect(() => {
  fetch('https://myposapi.onrender.com/api/v1/business-types')
    .then(res => res.json())
    .then(data => { if (data.success) setBusinessTypes(data.data); })
    .catch(err => console.error(err));
}, []);

  // Xử lý sau khi Google redirect về
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const stepParam = params.get('step');
  const provider = params.get('provider');
  const errorParam = params.get('error');
  const token = localStorage.getItem('token');

  // Nếu Google redirect về kèm lỗi → hiện thông báo
  if (errorParam === 'email_exists') {
    setError('Email này đã được đăng ký bằng Google! Vui lòng đăng nhập.');
  }

  // Nếu đã có token + step=3 + provider=google → nhảy thẳng vào Step 3
  // Google OAuth automatically completes step 1 & 2
  if (stepParam === '3' && provider === 'google' && token) {
    accessTokenRef.current = token;
    const googleCompleted = { step1: true, step2: true };
    setCompletedSteps(googleCompleted);
    localStorage.setItem('register_completed_steps', JSON.stringify(googleCompleted));
    setStep(3);
    window.history.replaceState({}, '', '/register');
  }
}, []);

  const hashPassword = async (password: string) => bcrypt.hash(password, 10);
  const startCooldown = () => { /* Logic đếm ngược giữ nguyên */
    setResendCooldown(60);
    const interval = setInterval(() => {
      setResendCooldown(prev => { if (prev <= 1) { clearInterval(interval); return 0; } return prev - 1; });
    }, 1000);
  };
  const goTransition = (nextStep: 1 | 2 | 3) => {
    setTransitioning(true);
    setTimeout(() => { setTransitioning(false); setStep(nextStep); }, 1000);
  };

  // Helper: Check if user can access a specific step
  const canAccessStep = (targetStep: 1 | 2 | 3): boolean => {
    if (targetStep === 1) return true; // Always can access step 1
    if (targetStep === 2) return completedSteps.step1; // Can access step 2 only if step 1 is completed
    if (targetStep === 3) return completedSteps.step1 && completedSteps.step2; // Can access step 3 only if both step 1 & 2 are completed
    return false;
  };

  // Helper: Mark a step as completed
  const markStepCompleted = (stepNum: 1 | 2) => {
    const updated = { ...completedSteps };
    if (stepNum === 1) updated.step1 = true;
    if (stepNum === 2) updated.step2 = true;
    setCompletedSteps(updated);
    localStorage.setItem('register_completed_steps', JSON.stringify(updated));
  };

  // Helper: Reset all completed steps (for starting over)
  const resetRegistration = () => {
    setCompletedSteps({ step1: false, step2: false });
    setStep1({ username: '', password: '', confirmPassword: '', fullName: '', email: '', phone: '' });
    setStep2({ otpCode: '' });
    localStorage.removeItem('register_completed_steps');
    localStorage.removeItem('register_step1');
    setStep(1);
  };

  // Các hàm Call API giữ nguyên nội dung
  const handleStep1 = async () => {
    setError('');
    
    // Validate required fields
    if (!step1.username || !step1.password || !step1.fullName || !step1.email) {
      return setError(r.errRequired);
    }

    // Validate fullName
    const fullNameValidation = validateFullName(step1.fullName);
    if (!fullNameValidation.valid) {
      return setError(fullNameValidation.error!);
    }

    // Validate username
    const usernameValidation = validateUsername(step1.username);
    if (!usernameValidation.valid) {
      return setError(usernameValidation.error!);
    }

    // Validate email
    const emailValidation = validateEmail(step1.email);
    if (!emailValidation.valid) {
      return setError(emailValidation.error!);
    }

    // Validate phone (optional but if provided, must be valid)
    if (step1.phone) {
      const phoneValidation = validatePhone(step1.phone);
      if (!phoneValidation.valid) {
        return setError(phoneValidation.error!);
      }
    }

    // Validate password
    const passwordValidation = validatePassword(step1.password);
    if (!passwordValidation.valid) {
      return setError(passwordValidation.errors.join('\n'));
    }

    // Check password match
    if (step1.password !== step1.confirmPassword) {
      return setError(r.errPassMatch);
    }

    localStorage.setItem('register_step1', JSON.stringify(step1));
    setLoading(true);
    try {
      const res = await fetch('https://myposapi.onrender.com/api/v1/auth/pre-register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: step1.email, username: step1.username }) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.message || r.errServerRegister);
        setLoading(false);
        return;
      }
      markStepCompleted(1);
      startCooldown(); setLoading(false); goTransition(2);
    } catch {
      setError(r.errConnect); setLoading(false);
    }
  };
  

  const handleStep2 = async () => {
    setError('');
    
    // Validate OTP
    const otpValidation = validateOTP(step2.otpCode);
    if (!otpValidation.valid) {
      return setError(otpValidation.error!);
    }
    
    setLoading(true);
    try {
      const resOtp = await fetch('https://myposapi.onrender.com/api/v1/auth/verify-email', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: step1.email, otpCode: step2.otpCode }) });
      const dataOtp = await resOtp.json();
      if (!resOtp.ok) { setError('OTP không hợp lệ'); setLoading(false); return; }

      verifiedTokenRef.current = dataOtp.verifiedToken;
      const hashPass = await hashPassword(step1.password);

      const resReg = await fetch('https://myposapi.onrender.com/api/v1/auth/register', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verifiedToken: verifiedTokenRef.current, username: step1.username, password: hashPass, fullName: step1.fullName, email: step1.email, phone: step1.phone })
      });
      const dataReg = await resReg.json();
      if (!resReg.ok) { setError(dataReg.message || r.errServerRegister); setLoading(false); return; }

      accessTokenRef.current = dataReg.access_token || dataReg.token;
      setStep3(prev => ({ ...prev, ownerName: step1.fullName, email: step1.email, phone: step1.phone }));
      markStepCompleted(2);
      setLoading(false); goTransition(3);
    } catch { setError(r.errConnect); setLoading(false); }
  };

  const handleStep3 = async () => {
    setError('');
    if (!step3.name || !step3.address || !step3.city || (!hasLodging && !hasSales)) return setError(r.errRequired);
    
    // Validate address
    const addressValidation = validateAddress(step3.address);
    if (!addressValidation.valid) {
      return setError(addressValidation.error!);
    }

    // Validate shop name
    if (step3.name.length < 2) {
      return setError('Tên cửa hàng phải có ít nhất 2 ký tự');
    }
    if (step3.name.length > 100) {
      return setError('Tên cửa hàng tối đa 100 ký tự');
    }

    // Validate số điện thoại cửa hàng 
    if (step3.phone) {
      const phoneValidation = validatePhone(step3.phone);
      if (!phoneValidation.valid) {
        return setError(phoneValidation.error!);
      }
    }

    // Validate email cửa hàng 
    if (step3.email) {
      const emailValidation = validateEmail(step3.email);
      if (!emailValidation.valid) {
        return setError(emailValidation.error!);
      }
    }

    // Validate tên chủ cửa hàng
    if (step3.ownerName) {
      const ownerNameValidation = validateFullName(step3.ownerName);
      if (!ownerNameValidation.valid) {
        return setError(ownerNameValidation.error!);
      }
    }
    
    const finalBusinessType: string[] = [];
    if (hasLodging) finalBusinessType.push('accommodation');
    if (hasSales) finalBusinessType.push('sale');
    
    setLoading(true);
    try {
      const res = await fetch('https://myposapi.onrender.com/api/v1/auth/shop/setup', {
        method: 'POST', 
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${accessTokenRef.current}`
        },
        body: JSON.stringify({ ...step3, businessType: finalBusinessType }),
      });
      
      const data = await res.json();
      
      if (!res.ok) { 
        setError(data.message || 'Lỗi khi tạo cửa hàng!'); 
        setLoading(false);
        return; 
      }
      
      localStorage.setItem('token', data.access_token || accessTokenRef.current);
      localStorage.removeItem('register_step1');
      window.location.href = '/download';// sau khi đăng ký xong
    } catch { 
      setError(r.errConnect); 
      setLoading(false); 
    }
  };

  const stepTitles = [r.step1Title, 'Xác thực Email', r.step2Title];
  const stepDescs = [r.step1Desc, `Nhập mã OTP đã gửi đến ${step1.email}`, r.step2Desc];

  return (
  <>
    <div style={{
      position: 'fixed',
      top: '16px',
      left: '16px',
      zIndex: 10001,
    }}>
    </div>

    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 16px', fontFamily: 'sans-serif' }}>
      
      {transitioning && <FullScreenLoader text={r.verifying} />}

      <div style={{ background: 'white', borderRadius: '24px', padding: '40px', width: '100%', maxWidth: '520px', boxShadow: '0 24px 64px rgba(37,99,235,0.15)' }}>
        
        {/* Header Logo */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ width: '64px', height: '64px', margin: '0 auto 12px', background: 'linear-gradient(135deg, #2563EB, #3B82F6)', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: '900', color: 'white' }}>M</div>
          <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#0F1419', margin: 0 }}>{stepTitles[step - 1]}</h1>
          <p style={{ color: '#6B7280', fontSize: '14px', marginTop: '6px' }}>{stepDescs[step - 1]}</p>
        </div>

        <StepIndicator step={step} r={r} />

        {error && <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '10px', padding: '12px 16px', color: '#DC2626', fontSize: '14px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}><AlertTriangle size={16} />{error}</div>}

        {/* Route Guards - Show error if user tries to skip steps */}
        {!canAccessStep(step) && (
          <div style={{ background: '#FEF3F2', border: '1px solid #FCA5A5', borderRadius: '10px', padding: '16px', color: '#DC2626', fontSize: '14px', marginBottom: '20px', textAlign: 'center' }}>
            <AlertTriangle size={20} style={{ marginBottom: '8px' }} />
            <p style={{ margin: '8px 0 0 0', fontWeight: '600' }}>⚠️ Bạn phải hoàn thành bước trước để tiếp tục!</p>
            <button onClick={() => { setStep(1); setError(''); }} style={{ marginTop: '12px', background: '#DC2626', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
              Quay lại Bước 1
            </button>
          </div>
        )}

        {/* Các Component Form */}
        {step === 1 && canAccessStep(1) && <Step1Account data={step1} setData={setStep1} onNext={handleStep1} loading={loading} r={r} />}
        {step === 2 && canAccessStep(2) && <Step2OTP data={step2} setData={setStep2} onNext={handleStep2} onBack={() => { setStep(1); setError(''); }} resendOTP={handleStep1} resendCooldown={resendCooldown} loading={loading} r={r} email={step1.email} />}
        {step === 3 && canAccessStep(3) && <Step3ShopSetup data={step3} setData={setStep3} hasLodging={hasLodging} setHasLodging={setHasLodging} hasSales={hasSales} setHasSales={setHasSales} onNext={handleStep3} onBack={() => { setStep(2); setError(''); }} loading={loading} r={r} CITIES={CITIES} businessTypes={businessTypes} />}
        
      </div>
    </div>
    </> 
  );
}