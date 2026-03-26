import { CheckCircle } from 'lucide-react';

export default function Step2VerifyOTP({ otpCode, setOtpCode, onNext, onBack, resendOTP, resendCooldown, loading }: any) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#2563EB', marginBottom: '6px' }}>Mã OTP *</label>
        <input style={{
          width: '100%', padding: '12px 16px', border: '2px solid #DBEAFE', borderRadius: '12px',
          fontSize: '24px', letterSpacing: '8px', fontWeight: '700', outline: 'none', 
          background: '#FAFAFA', color: '#0F1419', textAlign: 'center', boxSizing: 'border-box'
        }}
          placeholder="______" maxLength={6}
          value={otpCode}
          onChange={e => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
          onKeyDown={e => e.key === 'Enter' && onNext()}
        />
        <p style={{ fontSize: '12px', color: '#6B7280', marginTop: '8px', textAlign: 'center' }}>
          Mã OTP đã gửi đến email của bạn
        </p>
      </div>
      <button onClick={onNext} disabled={loading} style={{
        width: '100%', padding: '14px', background: loading ? '#C7D2FE' : 'linear-gradient(135deg, #2563EB, #3B82F6)',
        color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '700', 
        cursor: loading ? 'not-allowed' : 'pointer', boxShadow: '0 8px 24px rgba(37,99,235,0.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
      }}>
        {loading ? 'Đang xử lý...' : <><CheckCircle size={16} />Xác nhận OTP</>}
      </button>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#2563EB', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>← Quay lại</button>
        <button onClick={resendCooldown > 0 ? undefined : resendOTP} disabled={resendCooldown > 0} style={{
          background: 'none', border: 'none', color: resendCooldown > 0 ? '#9CA3AF' : '#2563EB', 
          fontSize: '14px', fontWeight: '600', cursor: resendCooldown > 0 ? 'not-allowed' : 'pointer',
        }}>
          {resendCooldown > 0 ? `Gửi lại (${resendCooldown}s)` : 'Gửi lại OTP'}
        </button>
      </div>
    </div>
  );
}