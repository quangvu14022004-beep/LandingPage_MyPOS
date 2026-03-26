export default function SettingsTab({ theme, toggleTheme, lang, setLang, colors, isDark, showToast }: any) {
  return (
    <div style={{ background: colors.card, borderRadius: 14, padding: 24, border: `1px solid ${colors.border}`, maxWidth: 500 }}>
      <div style={{ fontSize: 15, fontWeight: 600, color: colors.text, marginBottom: 20 }}>Cài đặt hệ thống</div>
      
      {/* Cài đặt Chủ đề */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, color: colors.textMuted, marginBottom: 10 }}>Chủ đề giao diện</div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => { if(theme === 'dark') toggleTheme(); }} style={{ padding: '8px 20px', borderRadius: 8, border: `2px solid ${theme === 'light' ? '#3B82F6' : colors.border}`, background: theme === 'light' ? (isDark ? '#3730a3' : '#DBEAFE') : 'transparent', color: theme === 'light' ? (isDark ? '#a5b4fc' : '#3B82F6') : colors.textMuted, cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>
            Sáng
          </button>
          <button onClick={() => { if(theme === 'light') toggleTheme(); }} style={{ padding: '8px 20px', borderRadius: 8, border: `2px solid ${theme === 'dark' ? '#3B82F6' : colors.border}`, background: theme === 'dark' ? (isDark ? '#1e1b4b' : '#DBEAFE') : 'transparent', color: theme === 'dark' ? (isDark ? '#a5b4fc' : '#3B82F6') : colors.textMuted, cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>
            Tối
          </button>
        </div>
      </div>

      {/* Cài đặt Ngôn ngữ */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, color: colors.textMuted, marginBottom: 10 }}>Ngôn ngữ (Language)</div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => { setLang('vi'); showToast('Đã chuyển sang Tiếng Việt'); }} style={{ padding: '8px 20px', borderRadius: 8, border: `2px solid ${lang === 'vi' ? '#3B82F6' : colors.border}`, background: lang === 'vi' ? (isDark ? '#3730a3' : '#ede9fe') : 'transparent', color: lang === 'vi' ? (isDark ? '#a5b4fc' : '#3B82F6') : colors.textMuted, cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>
            🇻🇳 Tiếng Việt
          </button>
          <button onClick={() => { setLang('en'); showToast('Switched to English'); }} style={{ padding: '8px 20px', borderRadius: 8, border: `2px solid ${lang === 'en' ? '#3B82F6' : colors.border}`, background: lang === 'en' ? (isDark ? '#3730a3' : '#ede9fe') : 'transparent', color: lang === 'en' ? (isDark ? '#a5b4fc' : '#3B82F6') : colors.textMuted, cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>
            🇬🇧 English
          </button>
          <button onClick={() => { setLang('zh'); showToast('已切换至中文'); }} style={{ padding: '8px 20px', borderRadius: 8, border: `2px solid ${lang === 'zh' ? '#3B82F6' : colors.border}`, background: lang === 'zh' ? (isDark ? '#3730a3' : '#ede9fe') : 'transparent', color: lang === 'zh' ? (isDark ? '#a5b4fc' : '#3B82F6') : colors.textMuted, cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>
            🇨🇳 中文
          </button>
        </div>
      </div>

      <div style={{ padding: '16px', background: isDark ? '#0f172a' : '#f8fafc', borderRadius: 10, fontSize: 13, color: colors.textMuted }}>
        Phiên bản: myPOS Admin v1.0.0
      </div>
    </div>
  );
}