import { useState } from 'react';
import { Users, UserCheck, UserX, Store } from 'lucide-react';

export default function OverviewTab({
  totalUsers, activeUsers, lockedUsers, salesUsers, lodgingUsers, bothUsers,
  MONTHLY_DATA, MONTHS, maxBar, users, colors, isDark, badgeStyle
}: any) {
  // State để theo dõi xem chuột đang rê vào thẻ nào (0, 1, 2, 3)
  const [hoverCard, setHoverCard] = useState<number | null>(null);

  const statCards = [
    { label: 'Tổng tài khoản', value: totalUsers, sub: '+2 hôm nay', icon: <Users size={20} />, color: '#3B82F6' },
    { label: 'Đang hoạt động', value: activeUsers, sub: `${Math.round(activeUsers / totalUsers * 100)}%`, icon: <UserCheck size={20} />, color: '#10b981' },
    { label: 'Bị khóa', value: lockedUsers, sub: `${Math.round(lockedUsers / totalUsers * 100)}%`, icon: <UserX size={20} />, color: '#ef4444' },
    { label: 'Tổng cửa hàng', value: totalUsers, sub: '+1 tuần này', icon: <Store size={20} />, color: '#f59e0b' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* 4 Thẻ Stats có hiệu ứng Hover */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
        {statCards.map((s, i) => {
          const isHovered = hoverCard === i; // Kiểm tra xem thẻ hiện tại có đang được hover không
          return (
            <div 
              key={i} 
              onMouseEnter={() => setHoverCard(i)}
              onMouseLeave={() => setHoverCard(null)}
              style={{ 
                background: colors.card, 
                borderRadius: 14, 
                padding: '18px 20px', 
                border: `1px solid ${isHovered ? s.color : colors.border}`, // Đổi màu viền khi hover
                display: 'flex', 
                alignItems: 'center', 
                gap: 14,
                cursor: 'pointer',
                transform: isHovered ? 'translateY(-6px)' : 'translateY(0)', // Hiệu ứng bay lên
                boxShadow: isHovered 
                  ? `0 12px 24px -8px ${s.color}80` // Đổ bóng phát sáng theo màu thẻ
                  : '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' // Hiệu ứng chuyển động mượt
              }}
            >
              <div style={{ 
                width: 44, height: 44, borderRadius: 12, 
                background: isHovered ? s.color : `${s.color}18`, // Đổ đầy màu nền icon khi hover
                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                color: isHovered ? 'white' : s.color, // Chuyển icon sang màu trắng khi hover
                flexShrink: 0,
                transition: 'all 0.3s ease'
              }}>
                {s.icon}
              </div>
              <div>
                <div style={{ fontSize: 11, color: colors.textMuted, marginBottom: 3 }}>{s.label}</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: colors.text }}>{s.value}</div>
                <div style={{ fontSize: 11, color: '#10b981' }}>{s.sub}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2 Biểu đồ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 14 }}>
        <div style={{ background: colors.card, borderRadius: 14, padding: 20, border: `1px solid ${colors.border}` }}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, color: colors.text }}>Người dùng mới theo tháng</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 160 }}>
            {MONTHLY_DATA.map((v: any, i: number) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{
                  width: '100%', borderRadius: '4px 4px 0 0',
                  background: i === 11 ? '#3B82F6' : `${isDark ? '#334155' : '#e2e8f0'}`,
                  height: Math.round((v / maxBar) * 130),
                  transition: 'all 0.3s',
                }} />
                <span style={{ fontSize: 9, color: colors.textMuted }}>{MONTHS[i]}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: colors.card, borderRadius: 14, padding: 20, border: `1px solid ${colors.border}` }}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, color: colors.text }}>Loại hình KD</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { label: 'Bán hàng', value: salesUsers, color: '#3B82F6' },
              { label: 'Lưu trú', value: lodgingUsers, color: '#10b981' },
              { label: 'Cả hai', value: bothUsers, color: '#f59e0b' },
            ].map((item, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: 12 }}>
                  <span style={{ color: colors.text }}>{item.label}</span>
                  <span style={{ color: colors.textMuted, fontWeight: 600 }}>{Math.round(item.value / totalUsers * 100)}%</span>
                </div>
                <div style={{ height: 6, background: isDark ? '#334155' : '#f1f5f9', borderRadius: 3 }}>
                  <div style={{ height: 6, background: item.color, borderRadius: 3, width: `${Math.round(item.value / totalUsers * 100)}%`, transition: 'width 0.5s' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bảng Top 5 Users */}
      <div style={{ background: colors.card, borderRadius: 14, padding: 20, border: `1px solid ${colors.border}`, overflowX: 'auto' }}>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 14, color: colors.text }}>Tài khoản mới nhất</div>
        <table style={{ width: '100%', minWidth: 600, borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr>
              {['Họ tên', 'Username', 'Loại hình', 'Thành phố', 'Trạng thái'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '8px 10px', color: colors.textMuted, fontWeight: 500, fontSize: 11, borderBottom: `1px solid ${colors.border}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.slice(0, 5).map((u: any) => (
              <tr key={u.id}>
                <td style={{ padding: '10px', borderBottom: `1px solid ${colors.border}`, color: colors.text }}>{u.fullName}</td>
                <td style={{ padding: '10px', borderBottom: `1px solid ${colors.border}`, color: colors.textMuted }}>{u.username}</td>
                <td style={{ padding: '10px', borderBottom: `1px solid ${colors.border}`, color: colors.textMuted }}>{u.businessType}</td>
                <td style={{ padding: '10px', borderBottom: `1px solid ${colors.border}`, color: colors.textMuted }}>{u.city}</td>
                <td style={{ padding: '10px', borderBottom: `1px solid ${colors.border}` }}>
                  <span style={badgeStyle(u.status)}>{u.status === 'active' ? 'Hoạt động' : 'Bị khóa'}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}