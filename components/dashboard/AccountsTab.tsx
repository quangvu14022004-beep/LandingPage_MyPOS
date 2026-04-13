  import { useState, useEffect } from 'react';
  import { Search, Edit2, Lock, Unlock, SlidersHorizontal, X } from 'lucide-react';

  const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
};
 const VIETNAM_PROVINCES = [
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

  export default function AccountsTab({ users, setUsers, onEditUser, showToast, onToggleStatus, colors, isDark, d }: any) {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [businessFilter, setBusinessFilter] = useState('');
    const [cityFilter, setCityFilter] = useState('');
    const [page, setPage] = useState(1);
    const [showFilter, setShowFilter] = useState(false);
    const isMobile = useIsMobile();
    const PER_PAGE = 10;

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
      const matchBusiness = businessFilter === '' || 
  (businessFilter === 'accommodation' && Array.isArray(u.businessType) && u.businessType.includes('accommodation') && u.businessType.length === 1) ||
  (businessFilter === 'sale' && Array.isArray(u.businessType) && u.businessType.includes('sale') && u.businessType.length === 1) ||
  (businessFilter === 'both' && Array.isArray(u.businessType) && u.businessType.includes('accommodation') && u.businessType.includes('sale'));

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
<div style={{ display: 'flex', gap: 10, marginBottom: 16, alignItems: 'center' }}>

  {/* Ô tìm kiếm */}
  <div style={{ position: 'relative', flex: 1 }}>
    <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: colors.textMuted }} />
    <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder={d?.search || 'Tìm kiếm tên, username, email...'} style={{ width: '100%', padding: '8px 8px 8px 32px', borderRadius: 8, border: `1px solid ${colors.border}`, background: colors.inputBg, color: colors.text, fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
  </div>

  {/* Nút lọc */}
  <div style={{ position: 'relative' }}>
    <button
      onClick={() => setShowFilter(!showFilter)}
      style={{
        padding: '8px 12px', borderRadius: 8, cursor: 'pointer', fontSize: 13,
        display: 'flex', alignItems: 'center', gap: 6,
        border: `1px solid ${(statusFilter || businessFilter || cityFilter) ? '#2563EB' : colors.border}`,
        background: (statusFilter || businessFilter || cityFilter) ? '#EFF6FF' : colors.inputBg,
        color: (statusFilter || businessFilter || cityFilter) ? '#2563EB' : colors.textMuted,
        fontWeight: (statusFilter || businessFilter || cityFilter) ? 700 : 400,
      }}
    >
      <SlidersHorizontal size={14} />
      {!isMobile && 'Bộ lọc'}
      {(statusFilter || businessFilter || cityFilter) && (
        <span style={{ background: '#2563EB', color: 'white', borderRadius: '50%', width: 16, height: 16, fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
          {[statusFilter, businessFilter, cityFilter].filter(Boolean).length}
        </span>
      )}
    </button>

    {/* Dropdown filter */}
    {showFilter && (
      <div style={{
      position: 'fixed', top: '50%', right: 16, transform: 'translateY(-50%)', zIndex: 1000,
      background: colors.card, border: `1px solid ${colors.border}`,
      borderRadius: 12, padding: 16, minWidth: 240,
      boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
      display: 'flex', flexDirection: 'column', gap: 10,
      maxHeight: '80vh', overflowY: 'auto',
    }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: colors.text }}>Bộ lọc</span>
          <button onClick={() => setShowFilter(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.textMuted }}>
            <X size={16} />
          </button>
        </div>

        {/* Lọc trạng thái */}
        <div>
          <label style={{ fontSize: 11, color: colors.textMuted, fontWeight: 600, display: 'block', marginBottom: 4 }}>TRẠNG THÁI</label>
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: `1px solid ${colors.border}`, background: colors.inputBg, color: colors.text, fontSize: 13, outline: 'none' }}>
            <option value="">{d?.allStatus || 'Tất cả trạng thái'}</option>
            <option value="active">{d?.active || 'Hoạt động'}</option>
            <option value="locked">{d?.locked || 'Bị khóa'}</option>
          </select>
        </div>

        {/* Lọc loại hình */}
        <div>
          <label style={{ fontSize: 11, color: colors.textMuted, fontWeight: 600, display: 'block', marginBottom: 4 }}>LOẠI HÌNH</label>
          <select value={businessFilter} onChange={e => { setBusinessFilter(e.target.value); setPage(1); }} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: `1px solid ${colors.border}`, background: colors.inputBg, color: colors.text, fontSize: 13, outline: 'none' }}>
            <option value="">{d?.allTypes || 'Tất cả loại hình'}</option>
            <option value="accommodation">{d?.accommodation || 'Lưu trú'}</option>
            <option value="sale">{d?.sale || 'Bán hàng'}</option>
            <option value="both">{d?.both || 'Cả hai'}</option>
          </select>
        </div>

        {/* Lọc tỉnh thành */}
        <div>
          <label style={{ fontSize: 11, color: colors.textMuted, fontWeight: 600, display: 'block', marginBottom: 4 }}>TỈNH THÀNH</label>
          <select value={cityFilter} onChange={e => { setCityFilter(e.target.value); setPage(1); }} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: `1px solid ${colors.border}`, background: colors.inputBg, color: colors.text, fontSize: 13, outline: 'none' }}>
            <option value="">{d?.allCities || 'Tất cả tỉnh thành'}</option>
            <option value="Chưa cập nhật">Chưa cập nhật</option>
            {VIETNAM_PROVINCES.map((province) => (
              <option key={province} value={province}>{province}</option>
            ))}
          </select>
        </div>

        {/* Nút xóa bộ lọc */}
        {(statusFilter || businessFilter || cityFilter) && (
          <button onClick={() => { setStatusFilter(''); setBusinessFilter(''); setCityFilter(''); setPage(1); setShowFilter(false); }} style={{ width: '100%', padding: '8px', borderRadius: 8, border: '1px solid #FECACA', background: '#FEF2F2', color: '#DC2626', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
            ✕ {d?.clearFilter || 'Xóa bộ lọc'}
          </button>
        )}
      </div>
    )}
  </div>
</div>

          {/* BẢNG DỮ LIỆU */}
          <table style={{ width: '100%', minWidth: 800, borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr>
                {([d?.fullName||'Họ tên', ...(isMobile ? [] : [d?.username||'Username', d?.email||'Email']), d?.businessType||'Loại hình', d?.city||'Thành phố', d?.status||'Trạng thái', d?.operations||'Thao tác'] as string[]).map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '8px 10px', color: colors.textMuted, fontWeight: 500, fontSize: 11, borderBottom: `1px solid ${colors.border}`, whiteSpace: 'nowrap' }}>{h}</th>
              ))}
              </tr>
            </thead>
            <tbody>
              {paginated.length > 0 ? (
                paginated.map((u: any) => (
                  <tr key={u.id}>
                    <td style={{ padding: '10px', borderBottom: `1px solid ${colors.border}`, color: colors.text, fontWeight: 500 }}>{u.fullName || 'Trống'}</td>
                    {!isMobile && <td style={{ padding: '10px', borderBottom: `1px solid ${colors.border}`, color: colors.textMuted }}>{u.username}</td>}
                    {!isMobile && <td style={{ padding: '10px', borderBottom: `1px solid ${colors.border}`, color: colors.textMuted }}>{u.email || 'Trống'}</td>}
                    <td style={{ padding: '10px', borderBottom: `1px solid ${colors.border}`, color: colors.textMuted, whiteSpace: 'nowrap'}}>
                                {Array.isArray(u.businessType) 
                                  ? u.businessType.map((t: string) => t === 'accommodation' ? 'Lưu trú' : 'Bán hàng').join(' + ')
                                  : u.businessType || 'Chưa cập nhật'}
                              </td>
                    <td style={{ padding: '10px', borderBottom: `1px solid ${colors.border}`, color: colors.textMuted,whiteSpace: 'nowrap' }}>{u.city}</td>
                    <td style={{ padding: '10px', borderBottom: `1px solid ${colors.border}` }}><span style={badgeStyle(u.status)}>{u.status === 'active' ? 'Hoạt động' : 'Bị khóa'}</span></td>
                    <td style={{ padding: '10px', borderBottom: `1px solid ${colors.border}` }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => onEditUser(u)} style={{ padding: '5px 10px', borderRadius: 6, border: `1px solid ${colors.border}`, background: 'transparent', color: colors.textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}><Edit2 size={12} /> {d?.edit || 'Sửa'}</button>
                        <button 
                            onClick={() => onToggleStatus(u)} 
                            style={{ padding: '5px 10px', borderRadius: 6, border: 'none', background: u.status === 'active' ? '#fee2e2' : '#dcfce7', color: u.status === 'active' ? '#991b1b' : '#166534', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600 }}
                          >
                            {u.status === 'active' ? <><Lock size={12} /> {d?.lock || 'Khóa'}</> : <><Unlock size={12} /> {d?.unlock || 'Mở khóa'}</>}
                          </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                // Báo lỗi khi lọc không ra ai
                <tr>
                  <td colSpan={isMobile ? 5 : 7} style={{ textAlign: 'center', padding: '30px', color: colors.textMuted, fontStyle: 'italic' }}>
                    {d?.noData || 'Không tìm thấy tài khoản nào'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* PHÂN TRANG */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, fontSize: 12, color: colors.textMuted }}>
  <span>{d?.page || 'Trang'} {page}/{totalPages}</span>
  <div style={{ display: 'flex', gap: 4 }}>
    {/* Nút Trước */}
    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: '5px 10px', borderRadius: 6, border: `1px solid ${colors.border}`, background: 'transparent', color: colors.textMuted, cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.4 : 1 }}>‹</button>

    {/* Số trang */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)} style={{
              padding: '5px 10px', borderRadius: 6, fontSize: 12, fontWeight: page === p ? 700 : 400,
              border: `1px solid ${page === p ? '#2563EB' : colors.border}`,
              background: page === p ? '#2563EB' : 'transparent',
              color: page === p ? 'white' : colors.textMuted,
              cursor: 'pointer',
              minWidth: 32,
            }}>{p}</button>
          ))}

          {/* Nút Sau */}
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ padding: '5px 10px', borderRadius: 6, border: `1px solid ${colors.border}`, background: 'transparent', color: colors.textMuted, cursor: page === totalPages ? 'not-allowed' : 'pointer', opacity: page === totalPages ? 0.4 : 1 }}>›</button>
        </div>
      </div>
        </div>
      </div>
    );
  }