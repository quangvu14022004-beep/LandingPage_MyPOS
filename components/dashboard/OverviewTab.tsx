import { useState, useEffect } from 'react';
import { Users, UserCheck, UserX, Store } from 'lucide-react';

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

function LineChart({ data, months, isDark, colors }: any) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimated(true), 100);
  }, []);

  const max = Math.max(...data, 1);
  const width = 500;
  const height = 160;
  const padL = 30, padR = 10, padT = 20, padB = 24;
  const chartW = width - padL - padR;
  const chartH = height - padT - padB;

  const points = data.map((v: number, i: number) => ({
    x: padL + (i / (data.length - 1)) * chartW,
    y: padT + chartH - (v / max) * chartH,
    value: v,
  }));

  const pathD = points.map((p: any, i: number) =>
  i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`
).join(' ');

  const areaD = `${pathD} L ${points[points.length-1].x} ${padT + chartH} L ${points[0].x} ${padT + chartH} Z`;

  return (
    <div style={{ position: 'relative' }}>
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.02" />
          </linearGradient>
          <linearGradient id="strokeGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#818CF8" />
            <stop offset="50%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
        </defs>
        {[0, 0.25, 0.5, 0.75, 1].map((v, i) => (
          <line key={i}
            x1={padL} y1={padT + chartH * (1 - v)}
            x2={padL + chartW} y2={padT + chartH * (1 - v)}
            stroke={isDark ? '#334155' : '#F1F5F9'} strokeWidth="1"
          />
        ))}
        <path d={areaD} fill="url(#lineGrad)"
          style={{ opacity: animated ? 1 : 0, transition: 'opacity 1s ease' }}
        />
        <path d={pathD} fill="none" stroke="url(#strokeGrad)" strokeWidth="2.5" strokeLinecap="round"
          style={{
            strokeDasharray: 1000,
            strokeDashoffset: animated ? 0 : 1000,
            transition: 'stroke-dashoffset 1.5s ease',
          }}
        />
        {points.map((p: any, i: number) => (
          <g key={i}>
            <text x={p.x} y={height - 4} textAnchor="middle"
              style={{ fontSize: 9, fill: colors.textMuted }}
            >{months[i]}</text>
            {data[i] > 0 && (
              <text x={p.x} y={p.y - 10} textAnchor="middle"
                style={{ fontSize: 9, fill: '#3B82F6', fontWeight: 700, opacity: animated ? 1 : 0, transition: `opacity 0.5s ease ${i * 0.1}s` }}
              >{data[i]}</text>
            )}
            <circle cx={p.x} cy={p.y} r={hoveredIndex === i ? 6 : 4}
              fill={hoveredIndex === i ? '#3B82F6' : 'white'}
              stroke="#3B82F6" strokeWidth="2"
              style={{ cursor: 'pointer', transition: 'all 0.2s', opacity: animated ? 1 : 0 }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            />
            {hoveredIndex === i && (
              <g>
                <rect x={p.x - 28} y={p.y - 36} width={56} height={24} rx={6} fill="#3B82F6" />
                <text x={p.x} y={p.y - 20} textAnchor="middle"
                  style={{ fontSize: 11, fill: 'white', fontWeight: 700 }}
                >{data[i]} user</text>
              </g>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}
export default function OverviewTab({
  totalUsers, activeUsers, lockedUsers, salesUsers, lodgingUsers, bothUsers,
  MONTHLY_DATA, MONTHS, maxBar, users, colors, isDark, badgeStyle
}: any) {
  // State để theo dõi xem chuột đang rê vào thẻ nào (0, 1, 2, 3)
  const [hoverCard, setHoverCard] = useState<number | null>(null);
  const isMobile = useIsMobile();

  const statCards = [
    { label: 'Tổng tài khoản', value: totalUsers, sub: '+2 hôm nay', icon: <Users size={20} />, color: '#3B82F6' },
    { label: 'Đang hoạt động', value: activeUsers, sub: `${Math.round(activeUsers / totalUsers * 100)}%`, icon: <UserCheck size={20} />, color: '#10b981' },
    { label: 'Bị khóa', value: lockedUsers, sub: `${Math.round(lockedUsers / totalUsers * 100)}%`, icon: <UserX size={20} />, color: '#ef4444' },
    { label: 'Tổng cửa hàng', value: totalUsers, sub: '+1 tuần này', icon: <Store size={20} />, color: '#f59e0b' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* 4 Thẻ Stats có hiệu ứng Hover */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
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
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))', gap: 14 }}>
        <div style={{ background: colors.card, borderRadius: 14, padding: 20, border: `1px solid ${colors.border}` }}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16, color: colors.text }}>Người dùng mới theo tháng</div>
          <LineChart data={MONTHLY_DATA} months={MONTHS} isDark={isDark} colors={colors} />
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
                <td style={{ padding: '10px', borderBottom: `1px solid ${colors.border}`, color: colors.textMuted }}>
                            {Array.isArray(u.businessType)
                              ? u.businessType.map((t: string) => t === 'rental' ? 'Lưu trú' : 'Bán hàng').join(' + ')
                              : 'Chưa cập nhật'}
                          </td>
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