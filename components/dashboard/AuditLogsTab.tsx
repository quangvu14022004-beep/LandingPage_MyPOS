'use client';
import { useState, useEffect } from 'react';
import { RefreshCw, CheckCircle, XCircle, Search } from 'lucide-react';

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

  useEffect(() => { fetchLogs(); }, [page, actionFilter, resourceFilter, successFilter]);

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
        <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: colors.textMuted }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm username, mô tả..." style={{ width: '100%', padding: '8px 8px 8px 32px', borderRadius: 8, border: `1px solid ${colors.border}`, background: colors.inputBg, color: colors.text, fontSize: 13, outline: 'none' }} />
          </div>
          <select value={actionFilter} onChange={e => { setActionFilter(e.target.value); setPage(1); }} style={{ padding: '8px 12px', borderRadius: 8, border: `1px solid ${colors.border}`, background: colors.inputBg, color: colors.text, fontSize: 13, outline: 'none' }}>
            <option value="">Tất cả hành động</option>
            {Object.entries(ACTION_LABELS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
          <select value={resourceFilter} onChange={e => { setResourceFilter(e.target.value); setPage(1); }} style={{ padding: '8px 12px', borderRadius: 8, border: `1px solid ${colors.border}`, background: colors.inputBg, color: colors.text, fontSize: 13, outline: 'none' }}>
            <option value="">Tất cả tài nguyên</option>
            {Object.entries(RESOURCE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <select value={successFilter} onChange={e => { setSuccessFilter(e.target.value); setPage(1); }} style={{ padding: '8px 12px', borderRadius: 8, border: `1px solid ${colors.border}`, background: colors.inputBg, color: colors.text, fontSize: 13, outline: 'none' }}>
            <option value="">Tất cả kết quả</option>
            <option value="true">Thành công</option>
            <option value="false">Thất bại</option>
          </select>
          <button onClick={fetchLogs} style={{ padding: '8px 12px', borderRadius: 8, border: `1px solid ${colors.border}`, background: 'transparent', color: colors.textMuted, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
            <RefreshCw size={14} /> Làm mới
          </button>
        </div>

        {/* BẢNG */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: colors.textMuted }}>Đang tải...</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr>
                {['Thời gian', 'Người dùng', 'Hành động', 'Tài nguyên', 'Mô tả', 'Kết quả'].map(h => (
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
                    <span style={{ padding: '3px 8px', borderRadius: 6, fontSize: 11, fontWeight: 700, background: `${ACTION_LABELS[log.action]?.color}20`, color: ACTION_LABELS[log.action]?.color }}>
                      {ACTION_LABELS[log.action]?.label || log.action}
                    </span>
                  </td>
                  <td style={{ padding: '10px', borderBottom: `1px solid ${colors.border}`, color: colors.textMuted }}>{RESOURCE_LABELS[log.resource] || log.resource}</td>
                  <td style={{ padding: '10px', borderBottom: `1px solid ${colors.border}`, color: colors.textMuted, maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{log.description || '—'}</td>
                  <td style={{ padding: '10px', borderBottom: `1px solid ${colors.border}` }}>
                    {log.success
                      ? <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#16A34A' }}><CheckCircle size={14} /> Thành công</span>
                      : <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#DC2626' }}><XCircle size={14} /> Thất bại</span>
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