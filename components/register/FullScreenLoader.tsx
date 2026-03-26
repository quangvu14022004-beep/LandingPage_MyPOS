export default function FullScreenLoader({ text }: { text: string }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(255,255,255,0.9)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 9999,
    }}>
      <div style={{
        width: '56px', height: '56px', border: '5px solid #DBEAFE',
        borderTop: '5px solid #2563EB', borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <p style={{ marginTop: '16px', color: '#2563EB', fontWeight: '700', fontSize: '15px' }}>{text}</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}