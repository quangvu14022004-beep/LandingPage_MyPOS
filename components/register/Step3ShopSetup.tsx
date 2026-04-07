import { useEffect } from 'react';
import AuthInput from './AuthInput';
import { BedDouble, ShoppingCart } from 'lucide-react';

export default function Step3ShopSetup({ data, setData, hasLodging, setHasLodging, hasSales, setHasSales, onNext, onBack, loading, r, CITIES, businessTypes }: any) {
  // ✅ Tự động lấy email từ localStorage khi component mount
  useEffect(() => {
    const googleEmail = localStorage.getItem('google_email');
    if (googleEmail && !data.email) {
      setData({ ...data, email: googleEmail });
    }
  }, []);

  // ✅ Xóa email khi user nhấn nút "Hoàn tất"
  const handleFinish = () => {
    localStorage.removeItem('google_email');
    onNext();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <AuthInput label={`${r.shopName} *`} placeholder={r.shopNamePh} value={data.name} onChange={e => setData({...data, name: e.target.value})} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <AuthInput label={`${r.ownerName} *`} placeholder={r.ownerNamePh} value={data.ownerName} onChange={e => setData({...data, ownerName: e.target.value})} />
        <AuthInput label={r.shopPhone} placeholder="0901234567" maxLength={10} value={data.phone} onChange={e => setData({...data, phone: e.target.value.replace(/\D/g, '').slice(0, 10)})} />
      </div>
      <AuthInput label={r.shopEmail} type="email" placeholder={r.shopEmailPh} value={data.email} onChange={e => setData({...data, email: e.target.value})} />
      
      {/* Checkbox */}
      <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
  {businessTypes && businessTypes.length > 0 ? (
    businessTypes.map((bt: any) => {
      const isChecked = bt._id === 'bt_accommodation' ? hasLodging : hasSales;
      const setChecked = bt._id === 'bt_accommodation' ? setHasLodging : setHasSales;
      return (
        <label key={bt._id} style={{
          flex: 1, display: 'flex', alignItems: 'center', gap: '10px',
          padding: '12px 16px', borderRadius: '12px', cursor: 'pointer',
          border: isChecked ? '2px solid #2563EB' : '2px solid #DBEAFE',
          background: isChecked ? '#EFF6FF' : 'white',
        }}>
          <input
            type="checkbox"
            checked={isChecked}
            onChange={e => setChecked(e.target.checked)}
            style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#2563EB' }}
          />
          <span style={{
            fontSize: '14px', fontWeight: '600',
            color: isChecked ? '#2563EB' : '#111827',
            WebkitTextFillColor: isChecked ? '#2563EB' : '#111827',
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {bt._id === 'bt_accommodation' ? (
                <BedDouble size={18} color={isChecked ? '#2563EB' : '#6B7280'} style={{ flexShrink: 0 }} />
              ) : (
                <ShoppingCart size={18} color={isChecked ? '#2563EB' : '#6B7280'} style={{ flexShrink: 0 }} />
              )}
              <span style={{
                fontSize: '14px', fontWeight: '600',
                color: isChecked ? '#2563EB' : '#111827',
                WebkitTextFillColor: isChecked ? '#2563EB' : '#111827',
              }}>
                {bt.name}
              </span>
            </span>
          </span>
        </label>
      );
    })
  ) : (
    <>
      <label style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', borderRadius: '12px', cursor: 'pointer', border: hasLodging ? '2px solid #2563EB' : '2px solid #DBEAFE', background: hasLodging ? '#EFF6FF' : 'white' }}>
        <input type="checkbox" checked={hasLodging} onChange={e => setHasLodging(e.target.checked)} style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#2563EB' }} />
        <span style={{ fontSize: '14px', fontWeight: '600', color: hasLodging ? '#2563EB' : '#111827', WebkitTextFillColor: hasLodging ? '#2563EB' : '#111827' }}>Lưu trú (Khách sạn)</span>
      </label>
      <label style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', borderRadius: '12px', cursor: 'pointer', border: hasSales ? '2px solid #2563EB' : '2px solid #DBEAFE', background: hasSales ? '#EFF6FF' : 'white' }}>
        <input type="checkbox" checked={hasSales} onChange={e => setHasSales(e.target.checked)} style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#2563EB' }} />
        <span style={{ fontSize: '14px', fontWeight: '600', color: hasSales ? '#2563EB' : '#111827', WebkitTextFillColor: hasSales ? '#2563EB' : '#111827' }}>POS & Bán lẻ</span>
      </label>
    </>
  )}
</div>

      <AuthInput label={`${r.address} *`} placeholder={r.addressPh} value={data.address} onChange={e => setData({...data, address: e.target.value})} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#2563EB', marginBottom: '6px' }}>{r.city} *</label>
          <select style={{ width: '100%', padding: '12px 16px', border: '2px solid #DBEAFE', borderRadius: '12px', fontSize: '15px', outline: 'none', background: '#FAFAFA', cursor: 'pointer' }} value={data.city} onChange={e => setData({...data, city: e.target.value})}>
            <option value="">{r.cityPh}</option>
            {CITIES.map((c: string) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <AuthInput label={r.taxCode} placeholder={r.taxCodePh} value={data.taxCode} onChange={e => setData({...data, taxCode: e.target.value})} />
      </div>

      <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
        <button onClick={onBack} style={{ flex: 1, padding: '14px', background: 'white', color: '#2563EB', border: '2px solid #2563EB', borderRadius: '12px', fontSize: '15px', fontWeight: '700', cursor: 'pointer' }}>{r.back}</button>
        <button onClick={handleFinish} disabled={loading} style={{ flex: 2, padding: '14px', background: loading ? '#C7D2FE' : 'linear-gradient(135deg, #2563EB, #3B82F6)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: '700', cursor: loading ? 'not-allowed' : 'pointer' }}>
          {loading ? r.finishing : r.finish}
        </button>
      </div>
    </div>
  );
}