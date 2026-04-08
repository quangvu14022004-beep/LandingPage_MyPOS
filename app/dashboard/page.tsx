'use client';

import { useState, useEffect } from 'react';
import { LogOut, Check, AlertCircle } from 'lucide-react';
import { useLang } from '@/lib/LanguageContext';

// Import các Component
import Sidebar from '@/components/dashboard/Sidebar';
import AccountsTab from '@/components/dashboard/AccountsTab';
import UserModal from '@/components/dashboard/UserModal';
import OverviewTab from '@/components/dashboard/OverviewTab';
import SettingsTab from '@/components/dashboard/SettingsTab';
import BusinessTypesTab from '@/components/dashboard/BusinessTypesTab';
import FullScreenLoader from '@/components/register/FullScreenLoader';
import AuditLogsTab from '@/components/dashboard/AuditLogsTab';

// Hook detect mobile
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
export default function DashboardPage() {
  const { lang, setLang, theme, toggleTheme, t } = useLang(); 
  const d = t.dashboard;
  const [section, setSection] = useState('dashboard');
  
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState<any>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const isDark = theme === 'dark';
  const isMobile = useIsMobile();

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // =================================================================
  //  [API] 1. LẤY DANH SÁCH USER TỪ DATABASE KHI LOAD TRANG
  // =================================================================
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('admin_token');
        // Đã sửa thành cổng 3001
        const res = await fetch('http://localhost:3001/api/v1/admin/users', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (res.ok) {
          const rawData = await res.json();
          
          const mappedUsers = rawData.map((u: any) => {
            // Lôi thông tin shop ra (nếu user có shopId)
            const shop = u.shopId;

            return {
              id: u._id,                 
              username: u.username,
              fullName: u.fullName,
              email: u.email,
              phone: u.phone,
              role: u.role,              
              status: u.isLocked ? 'locked' : 'active',
              
              //  Lấy Loại hình, Thành phố và Tên từ bảng Shop sang (Dùng shop?. để không bị lỗi nếu user chưa có shop)
              businessType: shop?.businessType || 'Chưa cập nhật', 
              city: shop?.city || 'Chưa cập nhật',
              shopName: shop?.name || 'Chưa liên kết',
              createdAt: u.createdAt,
            };
          });
          
          setUsers(mappedUsers);
        } else {
          showToast('Lỗi khi lấy dữ liệu', 'error');
        }
      } catch (error) {
        showToast('Không thể kết nối đến máy chủ', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // =================================================================
  //  [API] 2. THÊM MỚI HOẶC CẬP NHẬT USER VÀO DATABASE
  // =================================================================
  const handleSaveUser = async () => {
    if (!editUser) return;
    setIsLoading(true);
    const token = localStorage.getItem('admin_token');

    try {
      if (editUser.id) {
        const res = await fetch(`http://localhost:3001/api/v1/admin/users/${editUser.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(editUser)
        });

        if (res.ok) {
          setUsers(prev => prev.map(u => u.id === editUser.id ? { ...u, ...editUser } : u));
          showToast('Đã cập nhật tài khoản thành công!');
        } else {
          showToast('Cập nhật thất bại!', 'error');
        }
      } else {
        const payload = { ...editUser, status: 'active' };
        const res = await fetch(`http://localhost:3001/api/v1/admin/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          const newUser = await res.json(); 
          setUsers(prev => [...prev, newUser]);
          showToast('Đã thêm tài khoản mới!');
        } else {
          showToast('Thêm mới thất bại!', 'error');
        }
      }
    } catch (error) {
      showToast('Lỗi kết nối máy chủ', 'error');
    } finally {
      setIsLoading(false);
      setShowModal(false);
      setEditUser(null);
    }
  };

  // =================================================================
  //  [API] 3. KHÓA / MỞ KHÓA TÀI KHOẢN
  // =================================================================
  const handleToggleStatus = async (user: any) => {
    // Nếu trạng thái cũ là 'active' thì cái mới sẽ là 'locked' (tức là false)
    const newIsLocked = user.status === 'active';
    const newStatusString = newIsLocked ? 'locked' : 'active';
    const token = localStorage.getItem('admin_token');
    
    // Cập nhật giao diện ngay lập tức cho mượt
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: newStatusString } : u));

    try {
      // GỌI ĐÚNG ĐƯỜNG DẪN Backend: /toggle-status và truyền isActive
      const res = await fetch(`http://localhost:3001/api/v1/admin/users/${user.id}/toggle-status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ isLocked: newIsLocked }) 
      });

      if (res.ok) {
        showToast(`Đã ${newStatusString === 'locked' ? 'khóa' : 'mở khóa'} tài khoản thành công!`);
      } else {
        // Nếu API lỗi, trả lại trạng thái cũ
        setUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: user.status } : u));
        showToast('Lỗi khi thay đổi trạng thái!', 'error');
      }
    } catch (error) {
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: user.status } : u));
      showToast('Lỗi kết nối!', 'error');
    }
  };

  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === 'active').length;
  const lockedUsers = users.filter(u => u.status === 'locked').length;
  const salesUsers = users.filter(u => Array.isArray(u.businessType) && u.businessType.includes('sale') && u.businessType.length === 1).length;
  const lodgingUsers = users.filter(u => Array.isArray(u.businessType) && u.businessType.includes('accommodation') && u.businessType.length === 1).length;
  const bothUsers = users.filter(u => Array.isArray(u.businessType) && u.businessType.includes('accommodation') && u.businessType.includes('sale')).length;
  
  const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState(currentYear);

    // Lấy tất cả các năm có user, sắp xếp mới nhất lên đầu
    const availableYears = Array.from(
      new Set(
        users
          .map(u => u.createdAt ? new Date(u.createdAt).getFullYear() : null)
          .filter(Boolean)
      )
    ).sort((a: any, b: any) => b - a) as number[];

    // Đảm bảo năm hiện tại luôn có trong danh sách
    if (!availableYears.includes(currentYear)) {
      availableYears.unshift(currentYear);
    }

    // MONTHLY_DATA giờ tính theo selectedYear thay vì currentYear
    const MONTHLY_DATA = Array.from({ length: 12 }, (_, i) =>
      users.filter(u => {
        if (!u.createdAt) return false;
        const d = new Date(u.createdAt);
        return d.getFullYear() === selectedYear && d.getMonth() === i;
      }).length
    );
  const MONTHS = ['T1','T2','T3','T4','T5','T6','T7','T8','T9','T10','T11','T12'];
  const maxBar = Math.max(...MONTHLY_DATA, 1);

  const colors = {
    bg: isDark ? '#1C1F2E' : '#EFF6FF',
    card: isDark ? '#2A2F45' : '#FFFFFF',
    border: isDark ? '#363B55' : '#DBEAFE',
    text: isDark ? '#FFFFFF' : '#0F1419',
    textMuted: isDark ? '#A0AAC0' : '#6B7280',
    sidebarBg: isDark ? '#1E2235' : '#FFFFFF',
    inputBg: isDark ? '#242840' : '#FAFAFA',
  };

  const badgeStyle = (status: string) => ({
    padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 700,
    background: status === 'active' ? (isDark ? 'rgba(34, 197, 94, 0.15)' : '#DCFCE7') : (isDark ? 'rgba(239, 68, 68, 0.15)' : '#FEE2E2'),
    color: status === 'active' ? (isDark ? '#4ADE80' : '#14532d') : (isDark ? '#F87171' : '#7f1d1d'),
    border: `1px solid ${status === 'active' ? (isDark ? 'rgba(34, 197, 94, 0.3)' : '#BBF7D0') : (isDark ? 'rgba(239, 68, 68, 0.3)' : '#FECACA')}`
  });

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh', background: colors.bg, fontFamily: "'DM Sans', sans-serif", color: colors.text, overflowX: 'hidden' }}>

      {isLoading && <FullScreenLoader text="Đang đồng bộ dữ liệu..." />}

      <Sidebar section={section} setSection={setSection} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} colors={colors} isDark={isDark} d={d} />

      <div style={{ paddingLeft: isMobile ? 0 : (sidebarOpen ? 220 : 64), paddingBottom: isMobile ? 60 : 0, transition: 'padding-left 0.3s ease', minHeight: '100vh', display: 'flex', flexDirection: 'column', width: '100%', boxSizing: 'border-box' }}>
        <header style={{ position: 'sticky', top: 0, zIndex: 40, background: colors.card, borderBottom: `1px solid ${colors.border}`, padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: colors.text }}>
            {section === 'dashboard' && d.overview}
            {section === 'accounts' && d.accounts}
            {section === 'business-types' && d.businessTypes}
            {section === 'settings' && d.settings}
            {section === 'audit-logs' && d.auditLogs}
          </h2>
          <button onClick={() => {
          localStorage.removeItem('admin_token');
          window.location.href = '/login';
        }} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 8, border: `1px solid ${colors.border}`, background: 'transparent', color: colors.textMuted, cursor: 'pointer', fontSize: 13 }}>
          <LogOut size={14} /> Thoát
      </button>
        </header>

        <main style={{ flex: 1, padding: 24, width: '100%', maxWidth: '100%', boxSizing: 'border-box', overflowX: 'auto' }}>
          
          {section === 'dashboard' && (
            <OverviewTab 
            totalUsers={totalUsers} activeUsers={activeUsers} lockedUsers={lockedUsers}
            salesUsers={salesUsers} lodgingUsers={lodgingUsers} bothUsers={bothUsers}
            MONTHLY_DATA={MONTHLY_DATA} MONTHS={MONTHS} maxBar={maxBar}
            users={users} colors={colors} isDark={isDark} badgeStyle={badgeStyle}
            d={d}
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            availableYears={availableYears}
          />
          )}

          {section === 'accounts' && (
            <AccountsTab 
              users={users} setUsers={setUsers} 
              onEditUser={(u: any) => { setEditUser({ ...u }); setShowModal(true); }} 
              onToggleStatus={handleToggleStatus} 
              colors={colors} isDark={isDark} 
              d={d}
            />
          )}

          {section === 'business-types' && (
            <BusinessTypesTab users={users} colors={colors} isDark={isDark} badgeStyle={badgeStyle} showToast={showToast}
              d={d}
            />
          )}

          {section === 'settings' && (
            <SettingsTab theme={theme} toggleTheme={toggleTheme} lang={lang} setLang={setLang} colors={colors} isDark={isDark} showToast={showToast}
              d={d}
            />
          )}
          {section === 'audit-logs' && (
          <AuditLogsTab colors={colors} isDark={isDark} d={d} />
)}

        </main>
      </div>

      <UserModal showModal={showModal} setShowModal={setShowModal} editUser={editUser} setEditUser={setEditUser} handleSaveUser={handleSaveUser} colors={colors} />

      {toast && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 2000, background: toast.type === 'success' ? '#dcfce7' : '#fee2e2', color: toast.type === 'success' ? '#166534' : '#991b1b', padding: '12px 18px', borderRadius: 10, fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
          {toast.type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
          {toast.msg}
        </div>
      )}
    </div>
  );
}