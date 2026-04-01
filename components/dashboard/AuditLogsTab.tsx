'use client';
import { useState, useEffect } from 'react';
import { RefreshCw, CheckCircle, XCircle, Search, SlidersHorizontal, X } from 'lucide-react';

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

const ACTION_LABELS: Record<string, { label: string; color: string }> = {
  LOGIN:           { label: 'Đăng nhập',     color: '#2563EB' },
  LOGOUT:          { label: 'Đăng xuất',     color: '#6B7280' },
  CREATE:          { label: 'Tạo mới',       color: '#16A34A' },
  UPDATE:          { label: 'Cập nhật',      color: '#D97706' },
  DELETE:          { label: 'Xóa',           color: '#DC2626' },
  LOCK_USER:       { label: 'Khóa TK',       color: '#EF4444' },
  UNLOCK_USER:     { label: 'Mở khóa TK',   color: '#10B981' },
  CHANGE_PASSWORD: { label: 'Đổi mật khẩu', color: '#8B5CF6' },
  VIEW:            { label: 'Xem',           color: '#0EA5E9' },
  SYNC:            { label: 'Đồng bộ',       color: '#F59E0B' },
  EXPORT:          { label: 'Xuất dữ liệu',  color: '#06B6D4' },
};

const RESOURCE_LABELS: Record<string, string> = {
  USER: 'Tài khoản', SHOP: 'Cửa hàng', DEVICE: 'Thiết bị',
  BUSINESS_TYPE: 'Loại hình KD', AUTH: 'Xác thực', SYNC: 'Đồng bộ',
};

export default function AuditLogsTab({ colors, isDark }: any) {
  const isMobile = useIsMobile();
  const [showFilter, setShowFilter] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [actionFilter, setActionFilter] = useState('');
  const [resourceFilter, setResourceFilter] = useState('');
  const [successFilter, setSuccessFilter] = useState('');
  const [search, setSearch] = useState('');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('admin_token');
      const params = new URLSearchParams();
      params.append('page', String(page));
      params.append('limit', '10');
      if (actionFilter) params.append('action', actionFilter);
      if (resourceFilter) params.append('resource', resourceFilter);
      if (successFilter !== '') params.append('success', successFilter);

      const res = await fetch(`http://localhost:3001/api/v1/audit-logs?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setLogs(data.data || []);
      setMeta(data.meta || {});
    } catch {
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
  fetchLogs(); 
}, [page, actionFilter, resourceFilter, successFilter]);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getDate().toString().padStart(2,'0')}/${(d.getMonth()+1).toString().padStart(2,'0')}/${d.getFullYear()} ${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}`;
  };

  const filteredLogs = search
    ? logs.filter(l => l.actor_username?.toLowerCase().includes(search.toLowerCase()) || l.description?.toLowerCase().includes(search.toLowerCase()))
    : logs;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ background: colors.card, borderRadius: 14, padding: 20, border: `1px solid ${colors.border}` }}>

        {/* BỘ LỌC */}
<div style={{ display: 'flex', gap: 10, marginBottom: 16, alignItems: 'center' }}>

  {/* Ô tìm kiếm */}
  <div style={{ position: 'relative', flex: 1 }}>
    <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: colors.textMuted }} />
    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm username, mô tả..." style={{ width: '100%', padding: '8px 8px 8px 32px', borderRadius: 8, border: `1px solid ${colors.border}`, background: colors.inputBg, color: colors.text, fontSize: 13, outline: 'none', boxSizing: 'border-box' }} />
  </div>

  {/* Nút bộ lọc */}
  <div style={{ position: 'relative' }}>
    <button onClick={() => setShowFilter(!showFilter)} style={{
      padding: '8px 12px', borderRadius: 8, cursor: 'pointer', fontSize: 13,
      display: 'flex', alignItems: 'center', gap: 6,
      border: `1px solid ${(actionFilter || resourceFilter || successFilter) ? '#2563EB' : colors.border}`,
      background: (actionFilter || resourceFilter || successFilter) ? '#EFF6FF' : colors.inputBg,
      color: (actionFilter || resourceFilter || successFilter) ? '#2563EB' : colors.textMuted,
      fontWeight: (actionFilter || resourceFilter || successFilter) ? 700 : 400,
    }}>
      <SlidersHorizontal size={14} />
      {!isMobile && 'Bộ lọc'}
      {(actionFilter || resourceFilter || successFilter) && (
        <span style={{ background: '#2563EB', color: 'white', borderRadius: '50%', width: 16, height: 16, fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
          {[actionFilter, resourceFilter, successFilter].filter(Boolean).length}
        </span>
      )}
    </button>

    {/* Dropdown */}
    {showFilter && (
      <div style={{
        position: 'absolute', top: '110%', right: 0, zIndex: 100,
        background: colors.card, border: `1px solid ${colors.border}`,
        borderRadius: 12, padding: 16, minWidth: 240,
        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        display: 'flex', flexDirection: 'column', gap: 10,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: colors.text }}>Bộ lọc</span>
          <button onClick={() => setShowFilter(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: colors.textMuted }}><X size={16} /></button>
        </div>
        <div>
          <label style={{ fontSize: 11, color: colors.textMuted, fontWeight: 600, display: 'block', marginBottom: 4 }}>HÀNH ĐỘNG</label>
          <select value={actionFilter} onChange={e => { setActionFilter(e.target.value); setPage(1); }} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: `1px solid ${colors.border}`, background: colors.inputBg, color: colors.text, fontSize: 13, outline: 'none' }}>
            <option value="">Tất cả hành động</option>
            {Object.entries(ACTION_LABELS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>
        <div>
          <label style={{ fontSize: 11, color: colors.textMuted, fontWeight: 600, display: 'block', marginBottom: 4 }}>TÀI NGUYÊN</label>
          <select value={resourceFilter} onChange={e => { setResourceFilter(e.target.value); setPage(1); }} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: `1px solid ${colors.border}`, background: colors.inputBg, color: colors.text, fontSize: 13, outline: 'none' }}>
            <option value="">Tất cả tài nguyên</option>
            {Object.entries(RESOURCE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
        <div>
          <label style={{ fontSize: 11, color: colors.textMuted, fontWeight: 600, display: 'block', marginBottom: 4 }}>KẾT QUẢ</label>
          <select value={successFilter} onChange={e => { setSuccessFilter(e.target.value); setPage(1); }} style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: `1px solid ${colors.border}`, background: colors.inputBg, color: colors.text, fontSize: 13, outline: 'none' }}>
            <option value="">Tất cả kết quả</option>
            <option value="true">Thành công</option>
            <option value="false">Thất bại</option>
          </select>
        </div>
        {(actionFilter || resourceFilter || successFilter) && (
          <button onClick={() => { setActionFilter(''); setResourceFilter(''); setSuccessFilter(''); setPage(1); setShowFilter(false); }} style={{ width: '100%', padding: '8px', borderRadius: 8, border: '1px solid #FECACA', background: '#FEF2F2', color: '#DC2626', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
            ✕ Xóa bộ lọc
          </button>
        )}
      </div>
    )}
  </div>

  {/* Nút làm mới */}
  <button onClick={fetchLogs} style={{ padding: '8px 12px', borderRadius: 8, border: `1px solid ${colors.border}`, background: 'transparent', color: colors.textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, whiteSpace: 'nowrap' }}>
    <RefreshCw size={14} /> {!isMobile && 'Làm mới'}
  </button>
</div>

        {/* BẢNG */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: colors.textMuted }}>Đang tải...</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr>
                {(['Thời gian', 'Người dùng', 'Hành động', ...(isMobile ? [] : ['Tài nguyên', 'Mô tả']), 'Kết quả'] as string[]).map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '8px 10px', color: colors.textMuted, fontWeight: 500, fontSize: 11, borderBottom: `1px solid ${colors.border}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length > 0 ? filteredLogs.map((log: any) => (
                <tr key={log._id}>
                  <td style={{ padding: '10px', borderBottom: `1px solid ${colors.border}`, color: colors.textMuted, whiteSpace: 'nowrap' }}>{formatDate(log.createdAt)}</td>
                  <td style={{ padding: '10px', borderBottom: `1px solid ${colors.border}`, color: colors.text, fontWeight: 500 }}>{log.actor_username}</td>
                  <td style={{ padding: '10px', borderBottom: `1px solid ${colors.border}` }}>
                    <span style={{ padding: '3px 8px', borderRadius: 6, fontSize: 11, fontWeight: 700, background: `${ACTION_LABELS[log.action]?.color}20`, color: ACTION_LABELS[log.action]?.color, whiteSpace: 'nowrap', display: 'inline-block' }}>
                        {ACTION_LABELS[log.action]?.label || log.action}
                    </span>
                  </td>
                  {!isMobile && (
                    <td style={{ padding: '10px', borderBottom: `1px solid ${colors.border}`, color: colors.textMuted }}>{RESOURCE_LABELS[log.resource] || log.resource}</td>
                    )}
                  {!isMobile && (
                    <td style={{ padding: '10px', borderBottom: `1px solid ${colors.border}`, color: colors.textMuted, maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{log.description || '—'}</td>
                    )}
                  <td style={{ padding: '10px', borderBottom: `1px solid ${colors.border}` }}>
                    {log.success
                        ? <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#16A34A', whiteSpace: 'nowrap' }}><CheckCircle size={14} />{!isMobile && ' Thành công'}</span>
                        : <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#DC2626', whiteSpace: 'nowrap' }}><XCircle size={14} />{!isMobile && ' Thất bại'}</span>
                        }
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '30px', color: colors.textMuted, fontStyle: 'italic' }}>Chưa có nhật ký nào.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {/* PHÂN TRANG */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, fontSize: 12, color: colors.textMuted }}>
          <span>Trang {meta.page}/{meta.total_pages || 1} — {meta.total || 0} nhật ký</span>
          <div style={{ display: 'flex', gap: 4 }}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: '5px 10px', borderRadius: 6, border: `1px solid ${colors.border}`, background: 'transparent', color: colors.textMuted, cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.4 : 1 }}>‹</button>
            {Array.from({ length: meta.total_pages || 1 }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)} style={{ padding: '5px 10px', borderRadius: 6, fontSize: 12, fontWeight: page === p ? 700 : 400, border: `1px solid ${page === p ? '#2563EB' : colors.border}`, background: page === p ? '#2563EB' : 'transparent', color: page === p ? 'white' : colors.textMuted, cursor: 'pointer', minWidth: 32 }}>{p}</button>
            ))}
            <button onClick={() => setPage(p => Math.min(meta.total_pages || 1, p + 1))} disabled={page === meta.total_pages} style={{ padding: '5px 10px', borderRadius: 6, border: `1px solid ${colors.border}`, background: 'transparent', color: colors.textMuted, cursor: page === meta.total_pages ? 'not-allowed' : 'pointer', opacity: page === meta.total_pages ? 0.4 : 1 }}>›</button>
          </div>
        </div>
      </div>
    </div>
  );
}