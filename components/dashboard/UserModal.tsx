import { X, Check } from 'lucide-react';

export default function UserModal({ showModal, setShowModal, editUser, setEditUser, handleSaveUser, colors }: any) {
  if (!showModal) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }}>
      <div style={{ background: colors.card, borderRadius: 16, padding: 24, width: '100%', maxWidth: 440, border: `1px solid ${colors.border}`, maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: colors.text }}>{editUser?.id ? 'Sửa tài khoản' : 'Thêm tài khoản'}</h3>
          <button onClick={() => { setShowModal(false); setEditUser(null); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.textMuted }}><X size={18} /></button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { label: 'Họ tên', key: 'fullName', type: 'text', ph: 'Nhập họ tên' },
            { label: 'Username', key: 'username', type: 'text', ph: 'Nhập username' },
            { label: 'Email', key: 'email', type: 'email', ph: 'email@example.com' },
            { label: 'Số điện thoại', key: 'phone', type: 'text', ph: '0901234567' },
            { label: 'Tên cửa hàng', key: 'shopName', type: 'text', ph: 'Nhập tên cửa hàng' },
            { label: 'Thành phố', key: 'city', type: 'text', ph: 'Nhập thành phố' },
          ].map(f => (
            <div key={f.key}>
              <label style={{ fontSize: 12, color: colors.textMuted, display: 'block', marginBottom: 5 }}>{f.label}</label>
              <input type={f.type} placeholder={f.ph} value={editUser?.[f.key] || ''} onChange={e => setEditUser((p:any) => ({ ...p, [f.key]: e.target.value }))} style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: `1px solid ${colors.border}`, background: colors.inputBg, color: colors.text, fontSize: 13, outline: 'none' }} />
            </div>
          ))}
          <div>
            <label style={{ fontSize: 12, color: colors.textMuted, display: 'block', marginBottom: 5 }}>Loại hình</label>
            <select value={editUser?.businessType || 'bán hàng'} onChange={e => setEditUser((p:any) => ({ ...p, businessType: e.target.value }))} style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: `1px solid ${colors.border}`, background: colors.inputBg, color: colors.text, fontSize: 13, outline: 'none' }}>
              <option value="bán hàng">Bán hàng</option>
              <option value="lưu trú">Lưu trú</option>
              <option value="lưu trú/bán hàng">Cả hai</option>
            </select>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 20, justifyContent: 'flex-end' }}>
          <button onClick={() => { setShowModal(false); setEditUser(null); }} style={{ padding: '9px 20px', borderRadius: 8, border: `1px solid ${colors.border}`, background: 'transparent', color: colors.textMuted, cursor: 'pointer', fontSize: 13 }}>Hủy</button>
          <button onClick={handleSaveUser} style={{ padding: '9px 20px', borderRadius: 8, border: 'none', background: '#3B82F6', color: 'white', cursor: 'pointer', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}><Check size={14} /> Lưu</button>
        </div>
      </div>
    </div>
  );
}