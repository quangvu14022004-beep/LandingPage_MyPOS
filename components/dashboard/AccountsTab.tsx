import { useState } from 'react';
import { Search, Edit2, Lock, Unlock } from 'lucide-react';

const VIETNAM_PROVINCES = [
  "TP Hà Nội", "TP Hồ Chí Minh", "TP Đà Nẵng", "TP Hải Phòng", "TP Cần Thơ", "TP Huế",
  "An Giang", "Bắc Ninh", "Cà Mau", "Cao Bằng", "Đắk Lắk", 
  "Điện Biên", "Đồng Nai", "Đồng Tháp", "Gia Lai", "Hà Tĩnh", 
  "Hưng Yên", "Khánh Hòa", "Lai Châu", "Lâm Đồng", "Lạng Sơn", 
  "Lào Cai", "Nghệ An", "Ninh Bình", "Phú Thọ", "Quảng Ngãi", 
  "Quảng Ninh", "Quảng Trị", "Sơn La", "Tây Ninh", "Thái Nguyên", 
  "Thanh Hóa", "Tuyên Quang", "Vĩnh Long"
];

export default function AccountsTab({ users, setUsers, onEditUser, showToast, onToggleStatus, colors, isDark }: any) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [businessFilter, setBusinessFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [page, setPage] = useState(1);
  const PER_PAGE = 5;

  // ==========================================
  // LOGIC LỌC DỮ LIỆU (Đã tối ưu cực kỳ an toàn)
  // ==========================================
  const filtered = users.filter((u: any) => {
    // 1. Lọc từ khóa (Dùng thêm dấu ?. để lỡ fullName/email có trống thì web không bị sập)
    const matchSearch = search === '' || 
      u.fullName?.toLowerCase().includes(search.toLowerCase()) || 
      u.username?.toLowerCase().includes(search.toLowerCase()) || 
      u.email?.toLowerCase().includes(search.toLowerCase());

    // 2. Lọc trạng thái
    const matchStatus = statusFilter === '' || u.status === statusFilter;

    // 3. Lọc loại hình
    const matchBusiness = businessFilter === '' || u.businessType === businessFilter;

    // 4. Lọc thành phố
    const matchCity = cityFilter === '' || u.city === cityFilter;

    // Chỉ giữ lại những ai thỏa mãn CẢ 4 điều kiện
    return matchSearch && matchStatus && matchBusiness && matchCity;
  });

  // Tính toán phân trang an toàn (Nếu không có ai thì vẫn hiện trang 1/1)
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const badgeStyle = (status: string) => ({
    padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 700,
    background: status === 'active' ? (isDark ? 'rgba(34, 197, 94, 0.15)' : '#DCFCE7') : (isDark ? 'rgba(239, 68, 68, 0.15)' : '#FEE2E2'),
    color: status === 'active' ? (isDark ? '#4ADE80' : '#14532d') : (isDark ? '#F87171' : '#7f1d1d'),
    border: `1px solid ${status === 'active' ? (isDark ? 'rgba(34, 197, 94, 0.3)' : '#BBF7D0') : (isDark ? 'rgba(239, 68, 68, 0.3)' : '#FECACA')}`
  });
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ background: colors.card, borderRadius: 14, padding: 20, border: `1px solid ${colors.border}`, overflowX: 'auto' }}>
        
        {/* THANH BỘ LỌC */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: colors.textMuted }} />
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Tìm kiếm tên, username, email..." style={{ width: '100%', padding: '8px 8px 8px 32px', borderRadius: 8, border: `1px solid ${colors.border}`, background: colors.inputBg, color: colors.text, fontSize: 13, outline: 'none' }} />
          </div>
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} style={{ padding: '8px 12px', borderRadius: 8, border: `1px solid ${colors.border}`, background: colors.inputBg, color: colors.text, fontSize: 13, outline: 'none' }}>
            <option value="">Tất cả trạng thái</option>
            <option value="active">Hoạt động</option>
            <option value="locked">Bị khóa</option>
          </select>
          <select value={businessFilter} onChange={e => { setBusinessFilter(e.target.value); setPage(1); }} style={{ padding: '8px 12px', borderRadius: 8, border: `1px solid ${colors.border}`, background: colors.inputBg, color: colors.text, fontSize: 13, outline: 'none' }}>
            <option value="">Tất cả loại hình</option>
            <option value="bán hàng">Bán hàng</option>
            <option value="lưu trú">Lưu trú</option>
            <option value="lưu trú/bán hàng">Cả hai</option>
            <option value="hệ thống">Hệ thống</option>
          </select>
          <select value={cityFilter} onChange={e => { setCityFilter(e.target.value); setPage(1); }} style={{ padding: '8px 12px', borderRadius: 8, border: `1px solid ${colors.border}`, background: colors.inputBg, color: colors.text, fontSize: 13, outline: 'none' }}>
            <option value="">Tất cả tỉnh thành</option>
            <option value="Chưa cập nhật">Chưa cập nhật</option>
            {VIETNAM_PROVINCES.map((province) => (
              <option key={province} value={province}>{province}</option>
            ))}
          </select>
        </div>

        {/* BẢNG DỮ LIỆU */}
        <table style={{ width: '100%', minWidth: 800, borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr>
              {['Họ tên', 'Username', 'Email', 'Loại hình', 'Thành phố', 'Trạng thái', 'Thao tác'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '8px 10px', color: colors.textMuted, fontWeight: 500, fontSize: 11, borderBottom: `1px solid ${colors.border}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.length > 0 ? (
              paginated.map((u: any) => (
                <tr key={u.id}>
                  <td style={{ padding: '10px', borderBottom: `1px solid ${colors.border}`, color: colors.text, fontWeight: 500 }}>{u.fullName || 'Trống'}</td>
                  <td style={{ padding: '10px', borderBottom: `1px solid ${colors.border}`, color: colors.textMuted }}>{u.username}</td>
                  <td style={{ padding: '10px', borderBottom: `1px solid ${colors.border}`, color: colors.textMuted }}>{u.email || 'Trống'}</td>
                  <td style={{ padding: '10px', borderBottom: `1px solid ${colors.border}`, color: colors.textMuted }}>{u.businessType}</td>
                  <td style={{ padding: '10px', borderBottom: `1px solid ${colors.border}`, color: colors.textMuted }}>{u.city}</td>
                  <td style={{ padding: '10px', borderBottom: `1px solid ${colors.border}` }}><span style={badgeStyle(u.status)}>{u.status === 'active' ? 'Hoạt động' : 'Bị khóa'}</span></td>
                  <td style={{ padding: '10px', borderBottom: `1px solid ${colors.border}` }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => onEditUser(u)} style={{ padding: '5px 10px', borderRadius: 6, border: `1px solid ${colors.border}`, background: 'transparent', color: colors.textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}><Edit2 size={12} /> Sửa</button>
                      <button 
                          onClick={() => onToggleStatus(u)} 
                          style={{ padding: '5px 10px', borderRadius: 6, border: 'none', background: u.status === 'active' ? '#fee2e2' : '#dcfce7', color: u.status === 'active' ? '#991b1b' : '#166534', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600 }}
                        >
                          {u.status === 'active' ? <><Lock size={12} /> Khóa</> : <><Unlock size={12} /> Mở khóa</>}
                        </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              // Báo lỗi khi lọc không ra ai
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '30px', color: colors.textMuted, fontStyle: 'italic' }}>
                  Không tìm thấy tài khoản nào khớp với bộ lọc của bạn.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* PHÂN TRANG */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, fontSize: 12, color: colors.textMuted }}>
          <span>Trang {page}/{totalPages} — {filtered.length} tài khoản</span>
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: '5px 10px', borderRadius: 6, border: `1px solid ${colors.border}`, background: 'transparent', color: colors.textMuted, cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.4 : 1 }}>Trước</button>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ padding: '5px 10px', borderRadius: 6, border: `1px solid ${colors.border}`, background: 'transparent', color: colors.textMuted, cursor: page === totalPages ? 'not-allowed' : 'pointer', opacity: page === totalPages ? 0.4 : 1 }}>Sau</button>
          </div>
        </div>
      </div>
    </div>
  );
}