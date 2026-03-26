'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useLang } from '@/lib/LanguageContext';
import { ShoppingCart, Home, BarChart2, DollarSign, Store, UtensilsCrossed, Hotel, ShoppingBasket, LockKeyhole, Sun, Moon } from 'lucide-react';

const megaMenuData = {
  product: {
    vi: [
      { icon: <ShoppingCart size={20} color="white" />, title: 'POS Bán hàng', desc: 'Tạo đơn hàng nhanh, quản lý sản phẩm thông minh' },
      { icon: <Home size={20} color="white" />, title: 'Quản lý Lưu trú', desc: 'Quản lý phòng, check-in/out, thu tiền dịch vụ' },
      { icon: <BarChart2 size={20} color="white" />, title: 'Báo cáo Doanh thu', desc: 'Thống kê chi tiết, xuất Excel, kê khai thuế' },
      { icon: <DollarSign size={20} color="white" />, title: 'Quản lý Thu-Chi', desc: 'Ghi nhận thu chi, tính lợi nhuận tự động' },
    ],
    en: [
      { icon: <ShoppingCart size={20} color="white" />, title: 'POS Sales', desc: 'Fast order creation, smart product management' },
      { icon: <Home size={20} color="white" />, title: 'Accommodation', desc: 'Room management, check-in/out, billing' },
      { icon: <BarChart2 size={20} color="white" />, title: 'Revenue Reports', desc: 'Detailed stats, Excel export, tax filing' },
      { icon: <DollarSign size={20} color="white" />, title: 'Income & Expense', desc: 'Record finances, auto calculate profit' },
    ],
    zh: [
      { icon: <ShoppingCart size={20} color="white" />, title: 'POS销售', desc: '快速创建订单，智能产品管理' },
      { icon: <Home size={20} color="white" />, title: '住宿管理', desc: '房间管理、入住/退房、服务计费' },
      { icon: <BarChart2 size={20} color="white" />, title: '收入报告', desc: '详细统计、Excel导出、税务申报' },
      { icon: <DollarSign size={20} color="white" />, title: '收支管理', desc: '记录财务，自动计算利润' },
    ],
  },
  solution: {
    vi: [
      { icon: <Store size={20} color="white" />, title: 'Cửa hàng bán lẻ', desc: 'Giải pháp toàn diện cho shop, thời trang, điện tử' },
      { icon: <UtensilsCrossed size={20} color="white" />, title: 'Quán ăn & Cafe', desc: 'Quản lý bàn, order, bếp và thanh toán nhanh' },
      { icon: <Hotel size={20} color="white" />, title: 'Nhà trọ & Khách sạn', desc: 'Quản lý phòng, hợp đồng, thu tiền hàng tháng' },
      { icon: <ShoppingBasket size={20} color="white" />, title: 'Cửa hàng tạp hóa', desc: 'Quản lý hàng hoá, tồn kho và bán hàng nhanh' },
    ],
    en: [
      { icon: <Store size={20} color="white" />, title: 'Retail Store', desc: 'Complete solution for shops, fashion, electronics' },
      { icon: <UtensilsCrossed size={20} color="white" />, title: 'Restaurant & Cafe', desc: 'Table, order, kitchen and fast payment management' },
      { icon: <Hotel size={20} color="white" />, title: 'Hotel & Boarding', desc: 'Room, contract and monthly billing management' },
      { icon: <ShoppingBasket size={20} color="white" />, title: 'Grocery Store', desc: 'Manage goods, inventory and fast sales' },
    ],
    zh: [
      { icon: <Store size={20} color="white" />, title: '零售店', desc: '商店、时装、电子产品的完整解决方案' },
      { icon: <UtensilsCrossed size={20} color="white" />, title: '餐厅和咖啡馆', desc: '餐桌、点餐、厨房和快速支付管理' },
      { icon: <Hotel size={20} color="white" />, title: '酒店和住宿', desc: '房间、合同和月度账单管理' },
      { icon: <ShoppingBasket size={20} color="white" />, title: '杂货店', desc: '管理商品、库存和快速销售' },
    ],
  },
  support: {
    vi: [
      { icon: <LockKeyhole size={20} color="white" />, title: 'Đổi mật khẩu', desc: 'Thay đổi mật khẩu tài khoản', href: '/change-password' },
    ],
    en: [
      { icon: <LockKeyhole size={20} color="white" />, title: 'Change Password', desc: 'Update your account password', href: '/change-password' },
    ],
    zh: [
      { icon: <LockKeyhole size={20} color="white" />, title: '修改密码', desc: '更改您的账户密码', href: '/change-password' },
    ],
  },
};

type MenuKey = 'product' | 'solution' | 'support';

export default function Navbar() {
  const { lang, setLang, t, theme, toggleTheme } = useLang();
  const [openMenu, setOpenMenu] = useState<MenuKey | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isDark = theme === 'dark';

  const navBg = isDark ? '#0F1117' : 'white';
  const navBorder = isDark ? '#2D3148' : '#DBEAFE';
  const textColor = isDark ? '#F1F5F9' : '#0F1419';
  const dropBg = isDark ? '#1E2130' : 'white';
  const dropBorder = isDark ? '#2D3148' : '#DBEAFE';
  const hoverBg = isDark ? '#2D3148' : '#EFF6FF';
  const langBg = isDark ? '#1E2130' : '#EFF6FF';
  const subText = isDark ? '#94A3B8' : '#5A6570';

  const renderDropdown = (key: MenuKey) => {
    const items = megaMenuData[key][lang];
    return (
      <div style={{
        position: 'absolute', top: '42px', left: '-20px',
        background: dropBg, borderRadius: '16px', padding: '24px',
        boxShadow: '0 20px 60px rgba(37,99,235,0.18)',
        border: `2px solid ${dropBorder}`,
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: '12px', width: '480px', zIndex: 9999,
      }}>
        {items.map((item, i) => (
          <div key={i}
            style={{
              display: 'flex', alignItems: 'flex-start', gap: '12px',
              padding: '12px', borderRadius: '12px', cursor: 'pointer',
              transition: 'all 0.25s ease', border: '2px solid transparent',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = hoverBg;
              e.currentTarget.style.transform = 'scale(1.04)';
              e.currentTarget.style.border = '2px solid #3B82F6';
              const icon = e.currentTarget.querySelector('.menu-icon') as HTMLElement;
              if (icon) icon.style.background = 'linear-gradient(135deg, #1D4ED8, #2563EB)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.border = '2px solid transparent';
              const icon = e.currentTarget.querySelector('.menu-icon') as HTMLElement;
              if (icon) icon.style.background = 'linear-gradient(135deg, #2563EB, #3B82F6)';
            }}
          >
            <div className="menu-icon" style={{
              width: '40px', height: '40px', flexShrink: 0,
              background: 'linear-gradient(135deg, #2563EB, #3B82F6)',
              borderRadius: '10px', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.25s ease',
            }}>
              {item.icon}
            </div>
            <div>
              <div style={{ fontWeight: '700', fontSize: '14px', color: textColor, marginBottom: '4px' }}>
                {item.title}
              </div>
              <div style={{ fontSize: '12px', color: subText, lineHeight: '1.5' }}>
                {item.desc}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  const renderSupportDropdown = () => {
    const items = megaMenuData.support[lang];
    return (
      <div style={{
        position: 'absolute', top: '42px', left: '-20px',
        background: dropBg, borderRadius: '16px', padding: '16px',
        boxShadow: '0 20px 60px rgba(37,99,235,0.18)',
        border: `2px solid ${dropBorder}`,
        display: 'flex', flexDirection: 'column',
        gap: '8px', width: '260px', zIndex: 9999,
      }}>
        {items.map((item, i) => (
          <Link key={i} href={item.href} style={{ textDecoration: 'none' }}>
            <div
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px', borderRadius: '12px', cursor: 'pointer',
                transition: 'all 0.25s ease', border: '2px solid transparent',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = hoverBg;
                e.currentTarget.style.border = '2px solid #3B82F6';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.border = '2px solid transparent';
              }}
            >
              <div style={{
                width: '40px', height: '40px', flexShrink: 0,
                background: 'linear-gradient(135deg, #2563EB, #3B82F6)',
                borderRadius: '10px', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
              }}>
                {item.icon}
              </div>
              <div>
                <div style={{ fontWeight: '700', fontSize: '14px', color: textColor, marginBottom: '2px' }}>
                  {item.title}
                </div>
                <div style={{ fontSize: '12px', color: subText, lineHeight: '1.5' }}>
                  {item.desc}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    );
  };

  return (
    <nav style={{ background: navBg, borderBottom: `2px solid ${navBorder}`, transition: 'all 0.3s ease' }}>
      <div className="nav-container" style={{ height: '56px', gap: '8px', padding: '0 12px' }}>

        {/* Logo */}
        <Link href="/" className="logo" style={{ flexShrink: 0, gap: '8px' }}>
          <div className="logo-icon" style={{ width: '36px', height: '36px', fontSize: '18px' }}>M</div>
          <span className="logo-text" style={{ fontSize: '20px', color: textColor }}>myPOS</span>
        </Link>

        {/* Menu desktop */}
        <div className="nav-menu" style={{ gap: '4px', flex: 1, justifyContent: 'center', position: 'relative' }}>
          <div style={{ position: 'relative' }}
            onMouseEnter={() => setOpenMenu('product')}
            onMouseLeave={() => setOpenMenu(null)}
          >
            <span className={`nav-item ${openMenu === 'product' ? 'active' : ''}`}
              style={{ color: textColor }}>
              {t.nav.product} ▾
            </span>
            {openMenu === 'product' && renderDropdown('product')}
          </div>

          <div style={{ position: 'relative' }}
            onMouseEnter={() => setOpenMenu('solution')}
            onMouseLeave={() => setOpenMenu(null)}
          >
            <span className={`nav-item ${openMenu === 'solution' ? 'active' : ''}`}
              style={{ color: textColor }}>
              {t.nav.solution} ▾
            </span>
            {openMenu === 'solution' && renderDropdown('solution')}
          </div>

          {[
            { key: 'customer', href: '#map-section', label: t.nav.customer },
            { key: 'pricing',  href: '#',            label: t.nav.pricing },
            { key: 'news',     href: '#',            label: t.nav.news },
            { key: 'about', href: '/', label: t.nav.about },
          ].map((item) => (
            <Link key={item.key} href={item.href} className="nav-item" style={{ color: textColor }}>
              {item.label}
            </Link>
          ))}
          {/* Hỗ trợ — */}
          <div style={{ position: 'relative' }}
            onMouseEnter={() => setOpenMenu('support')}
            onMouseLeave={() => setOpenMenu(null)}
          >
            <span className={`nav-item ${openMenu === 'support' ? 'active' : ''}`}
              style={{ color: textColor, cursor: 'pointer' }}>
              {t.nav.support} ▾
            </span>
            {openMenu === 'support' && renderSupportDropdown()}
          </div>
        </div>

        {/* Bên phải */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>

          {/* Theme toggle */}
          <button onClick={toggleTheme} style={{
            background: isDark ? '#1E2130' : '#EFF6FF',
            border: 'none', borderRadius: '50%',
            width: '34px', height: '34px',
            cursor: 'pointer', fontSize: '16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.3s ease',
            flexShrink: 0,
          }}>
            {isDark ? <Sun size={18} color={isDark ? '#F1F5F9' : '#0F1419'} /> : <Moon size={18} color="#0F1419" />}
          </button>

          {/* Ngôn ngữ */}
          <div style={{ display: 'flex', gap: '2px', background: langBg, borderRadius: '8px', padding: '3px' }}>
            {(['vi', 'en', 'zh'] as const).map((l) => (
              <button key={l} onClick={() => setLang(l)} style={{
                width: '32px', height: '24px', borderRadius: '6px', border: 'none',
                cursor: 'pointer', fontWeight: '700', fontSize: '11px',
                background: lang === l ? 'linear-gradient(135deg, #2563EB, #3B82F6)' : 'transparent',
                color: lang === l ? 'white' : subText,
                transition: 'all 0.2s ease',
              }}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>

          {/*Đăng ký desktop */}
          <div className="nav-auth-desktop" style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <Link href="/register" target="_blank" rel="noopener noreferrer">
              <button className="btn-primary" style={{ padding: '7px 12px', fontSize: '12px', whiteSpace: 'nowrap' }}>
                {t.nav.register}
              </button>
            </Link>
          </div>

          {/* Hamburger mobile */}
          <button className="menu-toggle" onClick={() => setMobileOpen(!mobileOpen)}
            style={{ fontSize: '20px', padding: '4px 6px', color: textColor }}>
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div style={{
          position: 'fixed', top: '56px', left: 0, right: 0,
          background: navBg, zIndex: 9998,
          borderTop: `2px solid ${navBorder}`,
          boxShadow: '0 20px 40px rgba(37,99,235,0.15)',
          padding: '12px 16px 20px',
          display: 'flex', flexDirection: 'column', gap: '4px',
          maxHeight: 'calc(100vh - 56px)', overflowY: 'auto',
        }}>
          {[
            { href: '#features',        label: t.nav.product },
            { href: '#',                label: t.nav.solution },
            { href: '#map-section',     label: t.nav.customer },
            { href: '#',                label: t.nav.pricing },
            { href: '#',                label: t.nav.news },
            { href: '#about',           label: t.nav.about },
            { href: '/change-password', label: lang === 'vi' ? 'Đổi mật khẩu' : lang === 'en' ? 'Change Password' : '修改密码' },
          ].map((item, i) => (
            <Link key={i} href={item.href}
              onClick={() => setMobileOpen(false)}
              style={{
                padding: '13px 16px', borderRadius: '10px',
                color: textColor, fontWeight: '600', fontSize: '15px',
                textDecoration: 'none', transition: 'all 0.2s ease',
                borderBottom: `1px solid ${navBorder}`, display: 'block',
              }}
            >
              {item.label}
            </Link>
          ))}

          <div style={{ display: 'flex', gap: '8px', marginTop: '12px', padding: '0 4px' }}>
            <Link href="/login" target="_blank" rel="noopener noreferrer" style={{ flex: 1 }} onClick={() => setMobileOpen(false)}>
              <button className="btn-login" style={{ width: '100%', padding: '12px', fontSize: '14px' }}>
                {t.nav.login}
              </button>
            </Link>
            <Link href="/register" target="_blank" rel="noopener noreferrer" style={{ flex: 1 }} onClick={() => setMobileOpen(false)}>
              <button className="btn-primary" style={{ width: '100%', padding: '12px', fontSize: '14px' }}>
                {t.nav.register}
              </button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}