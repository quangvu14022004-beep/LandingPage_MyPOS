import { LayoutDashboard, Users, Building2, History, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

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

export default function Sidebar({ section, setSection, sidebarOpen, setSidebarOpen, colors, isDark, d }: any) {
  const isMobile = useIsMobile();

  const menuItems = [
  { id: 'dashboard', icon: <LayoutDashboard size={18} />, label: d?.overview || 'Tổng quan', mobileLabel: d?.overview || 'Tổng quan' },
  { id: 'accounts', icon: <Users size={18} />, label: d?.accounts || 'Tài khoản', mobileLabel: d?.accounts || 'Tài khoản' },
  { id: 'business-types', icon: <Building2 size={18} />, label: d?.businessTypes || 'Loại hình KD', mobileLabel: d?.businessTypesShort || d?.businessTypes || 'Loại hình' },
  { id: 'audit-logs', icon: <History size={18} />, label: d?.auditLogs || 'Nhật ký', mobileLabel: d?.auditLogs || 'Nhật ký' },
  { id: 'settings', icon: <Settings size={18} />, label: d?.settings || 'Cài đặt', mobileLabel: d?.settings || 'Cài đặt' },
];

  // MOBILE — Bottom Navigation
  if (isMobile) {
    return (
      <nav style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
        background: colors.card, borderTop: `1px solid ${colors.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-around',
        padding: '8px 0', height: 60,
      }}>
        {menuItems.map(item => (
          <button key={item.id} onClick={() => setSection(item.id)} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            padding: '4px 8px', borderRadius: 8, border: 'none',
            background: 'transparent',
            color: section === item.id ? '#3B82F6' : colors.textMuted,
            cursor: 'pointer', fontSize: 10, fontWeight: section === item.id ? 700 : 500,
            transition: 'all 0.2s',
          }}>
            <div style={{
              padding: '4px 12px', borderRadius: 20,
              background: section === item.id ? 'rgba(59,130,246,0.15)' : 'transparent',
              transition: 'all 0.2s',
            }}>
              {item.icon}
            </div>
            <span style={{ whiteSpace: 'nowrap', fontSize: 9 }}>{item.mobileLabel}</span>
          </button>
        ))}
      </nav>
    );
  }

  // DESKTOP — Sidebar như cũ
  return (
    <aside style={{
      position: 'fixed', top: 0, left: 0, height: '100vh',
      width: sidebarOpen ? 220 : 64, background: colors.sidebarBg,
      display: 'flex', flexDirection: 'column', transition: 'width 0.3s ease',
      borderRight: `1px solid ${colors.border}`, zIndex: 100
    }}>
      <div style={{ padding: '20px 16px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: `1px solid #ffffff15` }}>
        <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #3B82F6, #2563EB)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ color: 'white', fontWeight: 800, fontSize: 14 }}>M</span>
        </div>
        {sidebarOpen && <span style={{ color: colors.text, fontWeight: 700, fontSize: 15, whiteSpace: 'nowrap' }}>myPOS Admin</span>}
      </div>
      <div style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 4, overflowY: 'auto' }}>
        {menuItems.map(item => (
          <button key={item.id} onClick={() => setSection(item.id)} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: sidebarOpen ? '10px 12px' : '10px', borderRadius: 10,
            background: section === item.id ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
            border: 'none', color: section === item.id ? '#93C5FD' : (isDark ? '#A0AAC0' : '#524545'),
            cursor: 'pointer', width: '100%', textAlign: 'left',
            borderLeft: section === item.id ? '2px solid #3B82F6' : '2px solid transparent',
            fontSize: 13, fontWeight: section === item.id ? 700 : 600, transition: 'all 0.2s',
          }}>
            {item.icon}
            {sidebarOpen && <span style={{ whiteSpace: 'nowrap' }}>{item.label}</span>}
          </button>
        ))}
      </div>
      <div style={{ padding: 12, borderTop: '1px solid #ffffff15' }}>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: sidebarOpen ? 'flex-end' : 'center',
          gap: 8, padding: '8px', borderRadius: 8, border: 'none',
          background: 'transparent', color: '#64748b', cursor: 'pointer',
        }}>
          {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      </div>
    </aside>
  );
}