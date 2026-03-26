import { Eye, EyeOff } from 'lucide-react';

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  showPassBtn?: boolean;
  showPass?: boolean;
  onTogglePass?: () => void;
}

export default function AuthInput({
  label, type = "text", showPassBtn, showPass, onTogglePass, ...props
}: AuthInputProps) {
  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 16px', border: '2px solid #DBEAFE',
    borderRadius: '12px', fontSize: '15px', outline: 'none',
    background: '#FAFAFA', color: '#0F1419', transition: 'border-color 0.2s', boxSizing: 'border-box',
  };

  return (
    <div style={{ position: 'relative' }}>
      <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#2563EB', marginBottom: '6px' }}>
        {label}
      </label>
      <input type={type} style={inputStyle} {...props} />
      {showPassBtn && (
        <button type="button" onClick={onTogglePass} style={{
          position: 'absolute', right: '12px', top: '40px',
          background: 'none', border: 'none', cursor: 'pointer',
          fontSize: '18px', color: '#9CA3AF',
        }}>
          {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}
    </div>
  );
}