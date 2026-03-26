export default function StepIndicator({ step, r }: { step: number; r: any }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '28px', gap: '8px' }}>
      {[1, 2, 3].map((s) => (
        <div key={s} style={{ display: 'flex', alignItems: 'center', flex: s < 3 ? 1 : 'none' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '13px', fontWeight: '700', flexShrink: 0,
            background: step >= s ? '#2563EB' : '#DBEAFE',
            color: step >= s ? 'white' : '#9CA3AF',
          }}>{s}</div>
          {s < 3 && <div style={{ flex: 1, height: '2px', margin: '0 8px', background: step > s ? '#2563EB' : '#DBEAFE' }} />}
        </div>
      ))}
      <span style={{ fontSize: '13px', color: '#6B7280', marginLeft: '8px' }}>
        {r.step} {step}/3
      </span>
    </div>
  );
}