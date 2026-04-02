import { useState } from 'react';
import { Store, ShoppingCart, Hotel, Plus, X } from 'lucide-react';

export default function BusinessTypesTab({ users, colors, isDark, badgeStyle, showToast }: any) {
  // State lưu loại hình đang được click chọn ('bán hàng', 'lưu trú', hoặc 'lưu trú/bán hàng')
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const totalUsers = users.length;
  // Tính toán số lượng cho từng loại
 const salesCount = users.filter((u: any) => Array.isArray(u.businessType) && u.businessType.includes('sale') && u.businessType.length === 1).length;
const lodgingCount = users.filter((u: any) => Array.isArray(u.businessType) && u.businessType.includes('accommodation') && u.businessType.length === 1).length;
const bothCount = users.filter((u: any) => Array.isArray(u.businessType) && u.businessType.includes('accommodation') && u.businessType.includes('sale')).length;

  const types = [
    { id: 'sale', name: 'Bán hàng', desc: 'Quản lý sản phẩm, đơn hàng, doanh thu', count: salesCount, color: '#3B82F6', icon: <ShoppingCart size={32} /> },
    { id: 'accommodation', name: 'Lưu trú', desc: 'Quản lý phòng, hợp đồng, check-in/out', count: lodgingCount, color: '#10b981', icon: <Hotel size={32} /> },
    { id: 'both', name: 'Cả hai', desc: 'Kết hợp cả bán hàng và lưu trú', count: bothCount, color: '#f59e0b', icon: <Store size={32} /> },
  ];

  // Lọc ra danh sách user thuộc loại hình đang được chọn
  const displayedUsers = selectedType ? users.filter((u: any) => {
  if (!Array.isArray(u.businessType)) return false;
  if (selectedType === 'sale') return u.businessType.includes('sale') && u.businessType.length === 1;
  if (selectedType === 'accommodation') return u.businessType.includes('accommodation') && u.businessType.length === 1;
  if (selectedType === 'both') return u.businessType.includes('accommodation') && u.businessType.includes('sale');
  return false;
}) : [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: colors.text, margin: 0, flex: 1 }}>Danh sách loại hình kinh doanh</h3>
        <button onClick={() => showToast('Tính năng thêm loại hình đang được phát triển!')} style={{ 
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '8px 16px', 
          borderRadius: 8, border: 'none', background: '#3B82F6', color: 'white', 
          fontSize: 13, fontWeight: 600, cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(59,130,246,0.3)',
          whiteSpace: 'nowrap', flexShrink: 0,
        }}>
          <Plus size={14} /> Thêm loại hình
        </button>
</div>

      {/* 3 Thẻ Card cho phép Click */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
        {types.map((bt) => {
          const isSelected = selectedType === bt.id;
          return (
            <div 
              key={bt.id} 
              onClick={() => setSelectedType(isSelected ? null : bt.id)} // Click lại để bỏ chọn
              style={{ 
                background: colors.card, borderRadius: 14, padding: 24, 
                border: isSelected ? `2px solid ${bt.color}` : `2px solid ${colors.border}`, 
                cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: isSelected ? 'translateY(-4px)' : 'none',
                boxShadow: isSelected ? `0 12px 24px -8px ${bt.color}60` : '0 4px 6px -1px rgba(0,0,0,0.05)',
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 12, color: bt.color }}>{bt.icon}</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: colors.text, marginBottom: 6 }}>{bt.name}</div>
              <div style={{ fontSize: 13, color: colors.textMuted, marginBottom: 16, lineHeight: 1.6 }}>{bt.desc}</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 28, fontWeight: 800, color: bt.color }}>{bt.count}</span>
                <span style={{ fontSize: 12, color: colors.textMuted, fontWeight: 600 }}>CỬA HÀNG</span>
              </div>
              <div style={{ height: 4, background: isDark ? '#334155' : '#f1f5f9', borderRadius: 2, marginTop: 12 }}>
                <div style={{ height: 4, background: bt.color, borderRadius: 2, width: `${totalUsers > 0 ? Math.round(bt.count / totalUsers * 100) : 0}%`, transition: 'width 0.5s' }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Bảng Danh Sách User (Chỉ hiện khi có chọn 1 loại hình) */}
      {selectedType && (
        <div style={{ 
          background: colors.card, borderRadius: 14, padding: 20, 
          border: `1px solid ${colors.border}`, marginTop: 10,
          animation: 'fadeIn 0.3s ease-out' 
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h4 style={{ fontSize: 15, fontWeight: 700, color: colors.text, margin: 0 }}>
              Danh sách tài khoản: <span style={{ color: types.find(t => t.id === selectedType)?.color }}>{types.find(t => t.id === selectedType)?.name}</span>
            </h4>
            <button onClick={() => setSelectedType(null)} style={{ 
              background: isDark ? '#334155' : '#f1f5f9', border: 'none', color: colors.textMuted, 
              width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' 
            }}>
              <X size={16} />
            </button>
          </div>
          
          {displayedUsers.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', minWidth: 700, borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr>
                    {['Cửa hàng', 'Họ tên', 'Username', 'Thành phố', 'Trạng thái'].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '10px 12px', color: colors.textMuted, fontWeight: 600, fontSize: 11, borderBottom: `2px solid ${colors.border}` }}>{h.toUpperCase()}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {displayedUsers.map((u: any) => (
                    <tr key={u.id} style={{ transition: 'background 0.2s' }}>
                      <td style={{ padding: '12px', borderBottom: `1px solid ${colors.border}`, color: colors.text, fontWeight: 700 }}>{u.shopName || 'Chưa cập nhật'}</td>
                      <td style={{ padding: '12px', borderBottom: `1px solid ${colors.border}`, color: colors.textMuted }}>{u.fullName}</td>
                      <td style={{ padding: '12px', borderBottom: `1px solid ${colors.border}`, color: colors.textMuted }}>@{u.username}</td>
                      <td style={{ padding: '12px', borderBottom: `1px solid ${colors.border}`, color: colors.textMuted }}>{u.city}</td>
                      <td style={{ padding: '12px', borderBottom: `1px solid ${colors.border}` }}>
                        <span style={badgeStyle(u.status)}>{u.status === 'active' ? 'Hoạt động' : 'Bị khóa'}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ padding: '40px 0', textAlign: 'center', color: colors.textMuted, fontSize: 14 }}>
              Chưa có tài khoản nào thuộc loại hình này.
            </div>
          )}
        </div>
      )}
      
      {/* Style để tạo hiệu ứng mượt khi bảng hiện ra */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}