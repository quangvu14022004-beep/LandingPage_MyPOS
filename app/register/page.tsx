'use client';

import { useState, useRef, useEffect } from 'react';
import { useLang } from '@/lib/LanguageContext';
import * as bcrypt from 'bcryptjs';
import { AlertTriangle } from 'lucide-react';


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

const CITIES = [ 'Hà Nội', 'TP. Hồ Chí Minh', 'Hải Phòng', 'Đà Nẵng', 'Cần Thơ', 'Huế', 'An Giang', 'Bắc Ninh', 'Cao Bằng', 'Điện Biên', 'Đắk Lắk', 'Đồng Nai', 'Đồng Tháp', 'Gia Lai', 'Hà Tĩnh', 'Hưng Yên', 'Khánh Hòa', 'Kiên Giang', 'Lai Châu', 'Lâm Đồng', 'Lào Cai', 'Lạng Sơn', 'Nghệ An', 'Ninh Bình', 'Phú Thọ', 'Quảng Ninh', 'Quảng Ngãi', 'Quảng Trị', 'Sơn La', 'Thái Nguyên', 'Thanh Hóa', 'Tuyên Quang', 'Tây Ninh', 'Vĩnh Long' ];

export default function RegisterPage() {
  const { lang, setLang, t } = useLang();
  const r = t.register;
  
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [businessTypes, setBusinessTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [error, setError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

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
    if (raw) { try { setStep1(JSON.parse(raw)); } catch (e) { console.error(e); } }
  }, []);
  // Fetch danh sách businessTypes từ API
useEffect(() => {
  fetch('http://localhost:3001/api/business-types')
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
  if (stepParam === '3' && provider === 'google' && token) {
    accessTokenRef.current = token;
    setStep(3);
    // Xóa query params trên URL cho sạch
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

  // Các hàm Call API giữ nguyên nội dung
  const handleStep1 = async () => {
    setError('');
    if (!step1.username || !step1.password || !step1.fullName || !step1.email) return setError(r.errRequired);
    if (step1.password !== step1.confirmPassword) return setError(r.errPassMatch);
    if (step1.password.length < 6) return setError(r.errPassLen);
    
    localStorage.setItem('register_step1', JSON.stringify(step1));
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3001/api/auth/pre-register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: step1.email }) });
      if (!res.ok) { setError(r.errServerRegister); setLoading(false); return; }
      startCooldown(); setLoading(false); goTransition(2);
    } catch { setError(r.errConnect); setLoading(false); }
  };
  

  const handleStep2 = async () => {
    setError('');
    if (!step2.otpCode || step2.otpCode.length !== 6) return setError('Vui lòng nhập mã OTP 6 số');
    setLoading(true);
    try {
      const resOtp = await fetch('http://localhost:3001/api/auth/verify-email', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: step1.email, otpCode: step2.otpCode }) });
      const dataOtp = await resOtp.json();
      if (!resOtp.ok) { setError('OTP không hợp lệ'); setLoading(false); return; }

      verifiedTokenRef.current = dataOtp.verifiedToken;
      const hashPass = await hashPassword(step1.password);

      const resReg = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verifiedToken: verifiedTokenRef.current, username: step1.username, password: hashPass, fullName: step1.fullName, email: step1.email, phone: step1.phone })
      });
      const dataReg = await resReg.json();
      if (!resReg.ok) { setError(dataReg.message || r.errServerRegister); setLoading(false); return; }

      accessTokenRef.current = dataReg.access_token || dataReg.token;
      setStep3(prev => ({ ...prev, ownerName: step1.fullName, email: step1.email, phone: step1.phone }));
      setLoading(false); goTransition(3);
    } catch { setError(r.errConnect); setLoading(false); }
  };

  const handleStep3 = async () => {
    setError('');
    if (!step3.name || !step3.address || !step3.city || (!hasLodging && !hasSales)) return setError(r.errRequired);
    
    const finalBusinessType: string[] = [];
    if (hasLodging) finalBusinessType.push('rental');
    if (hasSales) finalBusinessType.push('sale');
    
    setLoading(true);
    try {
      // ✅ Xóa /v1 đi, nhưng THÊM Authorization chứa Token vào headers
      const res = await fetch('http://localhost:3001/api/auth/shop/setup', {
        method: 'POST', 
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${accessTokenRef.current}` // 🔑 Chìa khóa ở đây!
        },
        body: JSON.stringify({ ...step3, businessType: finalBusinessType }),
      });
      
      const data = await res.json();
      
      // Kiểm tra nếu lỗi 401 (hoặc lỗi khác)
      if (!res.ok) { 
        setError(data.message || 'Lỗi khi tạo cửa hàng!'); 
        setLoading(false);
        return; 
      }
      
      localStorage.setItem('token', data.access_token || accessTokenRef.current);
      localStorage.removeItem('register_step1');
      window.location.href = '/dashboard';
    } catch { 
      setError(r.errConnect); 
      setLoading(false); 
    }
  };

  const stepTitles = [r.step1Title, 'Xác thực Email', r.step2Title];
  const stepDescs = [r.step1Desc, `Nhập mã OTP đã gửi đến ${step1.email}`, r.step2Desc];

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 16px', fontFamily: 'sans-serif' }}>
      
      {transitioning && <FullScreenLoader text={r.verifying} />}

      {/* Nút về home & Đổi ngôn ngữ (Bạn có thể tách thành RegisterHeader.tsx nếu muốn) */}
      <button onClick={() => window.location.href = '/home'} style={{ position: 'fixed', top: '20px', left: '20px', background: 'white', border: '2px solid #DBEAFE', borderRadius: '12px', padding: '8px 16px', color: '#2563EB', fontWeight: '600', cursor: 'pointer' }}>← Trang chủ</button>

      <div style={{ background: 'white', borderRadius: '24px', padding: '40px', width: '100%', maxWidth: '520px', boxShadow: '0 24px 64px rgba(37,99,235,0.15)' }}>
        
        {/* Header Logo */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ width: '64px', height: '64px', margin: '0 auto 12px', background: 'linear-gradient(135deg, #2563EB, #3B82F6)', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: '900', color: 'white' }}>M</div>
          <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#0F1419', margin: 0 }}>{stepTitles[step - 1]}</h1>
          <p style={{ color: '#6B7280', fontSize: '14px', marginTop: '6px' }}>{stepDescs[step - 1]}</p>
        </div>

        <StepIndicator step={step} r={r} />

        {error && <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '10px', padding: '12px 16px', color: '#DC2626', fontSize: '14px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}><AlertTriangle size={16} />{error}</div>}

        {/* Các Component Form */}
        {step === 1 && <Step1Account data={step1} setData={setStep1} onNext={handleStep1} loading={loading} r={r} />}
        {step === 2 && <Step2OTP data={step2} setData={setStep2} onNext={handleStep2} onBack={() => { setStep(1); setError(''); }} resendOTP={handleStep1} resendCooldown={resendCooldown} loading={loading} r={r} email={step1.email} />}
        {step === 3 && <Step3ShopSetup data={step3} setData={setStep3} hasLodging={hasLodging} setHasLodging={setHasLodging} hasSales={hasSales} setHasSales={setHasSales} onNext={handleStep3} onBack={() => { setStep(2); setError(''); }} loading={loading} r={r} CITIES={CITIES} businessTypes={businessTypes} />}
        
      </div>
    </div>
  );
}