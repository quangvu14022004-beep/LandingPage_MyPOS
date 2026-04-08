import { X, Check } from 'lucide-react';

//  MẢNG 34 TỈNH THÀNH 
const VIETNAM_PROVINCES = [
  "Hà Nội", "TP. Hồ Chí Minh", "Đà Nẵng", "Hải Phòng", "Cần Thơ", "Huế",
  "An Giang", "Bắc Ninh", "Cà Mau", "Cao Bằng", "Đắk Lắk",
  "Điện Biên", "Đồng Nai", "Đồng Tháp", "Gia Lai", "Hà Tĩnh",
  "Hưng Yên", "Khánh Hòa", "Lai Châu", "Lâm Đồng", "Lạng Sơn",
  "Lào Cai", "Nghệ An", "Ninh Bình", "Phú Thọ", "Quảng Ngãi",
  "Quảng Ninh", "Quảng Trị", "Sơn La", "Tây Ninh", "Thái Nguyên",
  "Thanh Hóa", "Tuyên Quang", "Vĩnh Long", "Nha Trang"
];

export default function UserModal({ showModal, setShowModal, editUser, setEditUser, handleSaveUser, colors }: any) {
  if (!showModal) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }}>
      <div style={{ background: colors.card, borderRadius: 16, padding: 24, width: '100%', maxWidth: 440, border: `1px solid ${colors.border}`, maxHeight: '90vh', overflowY: 'auto' }}>
        
        {/* TIÊU ĐỀ */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: colors.text }}>{editUser?.id ? 'Sửa tài khoản' : 'Thêm tài khoản'}</h3>
          <button onClick={() => { setShowModal(false); setEditUser(null); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.textMuted }}><X size={18} /></button>
        </div>
        
        {/* NỘI DUNG FORM */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          
          {/* 1. Các ô nhập chữ (Đã xóa Thành phố ra khỏi đây) */}
          {[
            { label: 'Họ tên', key: 'fullName', type: 'text', ph: 'Nhập họ tên' },
            { label: 'Username', key: 'username', type: 'text', ph: 'Nhập username' },
            { label: 'Email', key: 'email', type: 'email', ph: 'email@example.com' },
            { label: 'Số điện thoại', key: 'phone', type: 'text', ph: '0901234567' },
            { label: 'Tên cửa hàng', key: 'shopName', type: 'text', ph: 'Nhập tên cửa hàng' },
          ].map(f => (
            <div key={f.key}>
              <label style={{ fontSize: 12, color: colors.textMuted, display: 'block', marginBottom: 5 }}>{f.label}</label>
              <input type={f.type} placeholder={f.ph} value={editUser?.[f.key] || ''} onChange={e => setEditUser((p:any) => ({ ...p, [f.key]: e.target.value }))} style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: `1px solid ${colors.border}`, background: colors.inputBg, color: colors.text, fontSize: 13, outline: 'none' }} />
            </div>
          ))}

          {/* 2.  DANH SÁCH CHỌN THÀNH PHỐ Ở ĐÂY */}
          <div>
            <label style={{ fontSize: 12, color: colors.textMuted, display: 'block', marginBottom: 5 }}>Thành phố</label>
            <select value={editUser?.city || ''} onChange={e => setEditUser((p:any) => ({ ...p, city: e.target.value }))} style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: `1px solid ${colors.border}`, background: colors.inputBg, color: colors.text, fontSize: 13, outline: 'none' }}>
              <option value="" disabled>-- Chọn Tỉnh/Thành phố --</option>
              {VIETNAM_PROVINCES.map((province) => (
                <option key={province} value={province}>{province}</option>
              ))}
            </select>
          </div>

          {/* 3. Danh sách chọn Loại hình */}
          <div>
            <label style={{ fontSize: 12, color: colors.textMuted, display: 'block', marginBottom: 5 }}>Loại hình</label>
            <select
                value={
                  Array.isArray(editUser?.businessType)
                    ? editUser.businessType.includes('rental') && editUser.businessType.includes('sale')
                      ? 'both'
                      : editUser.businessType.includes('rental') ? 'rental' : 'sale'
                    : 'sale'
                }
                onChange={e => {
                  const val = e.target.value;
                  const bt = val === 'both' ? ['rental', 'sale'] : val === 'rental' ? ['rental'] : ['sale'];
                  setEditUser((p: any) => ({ ...p, businessType: bt }));
                }}
                style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: `1px solid ${colors.border}`, background: colors.inputBg, color: colors.text, fontSize: 13, outline: 'none' }}
              >
                <option value="sale">Bán hàng</option>
                <option value="rental">Lưu trú</option>
                <option value="both">Cả hai</option>
        </select>
          </div>

        </div>

        {/* NÚT BẤM DƯỚI CÙNG */}
        <div style={{ display: 'flex', gap: 10, marginTop: 20, justifyContent: 'flex-end' }}>
          <button onClick={() => { setShowModal(false); setEditUser(null); }} style={{ padding: '9px 20px', borderRadius: 8, border: `1px solid ${colors.border}`, background: 'transparent', color: colors.textMuted, cursor: 'pointer', fontSize: 13 }}>Hủy</button>
          <button onClick={handleSaveUser} style={{ padding: '9px 20px', borderRadius: 8, border: 'none', background: '#3B82F6', color: 'white', cursor: 'pointer', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}><Check size={14} /> Lưu</button>
        </div>

      </div>
    </div>
  );
}