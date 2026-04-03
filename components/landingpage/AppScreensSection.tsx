'use client';
import { useState, useEffect, useRef } from 'react';
import { useLang } from '@/lib/LanguageContext';



export default function AppScreensSection({ isDark = true }: { isDark?: boolean }) {
  const { t } = useLang();
  const screens = (t.appScreens.screens as { label: string; desc: string }[]).map((s, i) => ({
    id: i,
    src: `/screenshots/screen${i + 1}.png`,
    label: s.label,
    desc: s.desc,
  }));
  const [active, setActive] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startX = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive(prev => (prev + 1) % screens.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const prev = () => setActive(p => (p - 1 + screens.length) % screens.length);
  const next = () => setActive(p => (p + 1) % screens.length);

  // Swipe support
  const handleTouchStart = (e: any) => { startX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: any) => {
    const diff = startX.current - e.changedTouches[0].clientX;
    if (diff > 50) next();
    else if (diff < -50) prev();
  };
  const handleMouseDown = (e: any) => { setDragging(true); startX.current = e.clientX; };
  const handleMouseUp = (e: any) => {
    if (!dragging) return;
    setDragging(false);
    const diff = startX.current - e.clientX;
    if (diff > 50) next();
    else if (diff < -50) prev();
  };

  const getStyle = (index: number) => {
    const total = screens.length;
    let diff = index - active;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;

    const absD = Math.abs(diff);

    if (absD > 1) return { display: 'none' };

    const scale = diff === 0 ? 1.08 : 0.82;
    const translateX = diff * 220;
    const opacity = diff === 0 ? 1 : 0.5;
    const zIndex = diff === 0 ? 10 : 5;
    const blur = diff === 0 ? 0 : 2;

    return {
      position: 'absolute' as const,
      left: '50%',
      transform: `translateX(calc(-50% + ${translateX}px)) scale(${scale})`,
      opacity,
      zIndex,
      filter: `blur(${blur}px)`,
      transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: diff === 0 ? 'default' : 'pointer',
    };
  };

  return (
    <section style={{
      padding: '80px 24px',
      background: isDark ? 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)' : 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
      overflow: 'hidden',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div style={{
            display: 'inline-block', padding: '6px 16px', borderRadius: '20px',
            background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)',
            color: '#60A5FA', fontSize: '13px', fontWeight: '600', marginBottom: '16px',
          }}>
            {t.appScreens.badge}
          </div>
          <h2 style={{ fontSize: '36px', fontWeight: '800', color: isDark ? 'white' : '#0F172A', margin: '0 0 16px' }}>
            {t.appScreens.title}{' '}
            <span style={{
              background: 'linear-gradient(135deg, #3B82F6, #60A5FA)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>{t.appScreens.titleHighlight}</span>
          </h2>
          <p style={{ color: isDark ? '#94A3B8' : '#5A6570', fontSize: '16px', maxWidth: '500px', margin: '0 auto' }}>
            {t.appScreens.desc}
          </p>
        </div>

        {/* Carousel */}
        <div
          style={{ position: 'relative', height: '520px', userSelect: 'none' }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
        >
          {screens.map((s, i) => (
            <div key={s.id} style={getStyle(i)} onClick={() => { if (i !== active) setActive(i); }}>
              {/* Phone frame - đơn giản, */}
              <div style={{
                width: '220px',
                background: isDark ? '#0F172A' : '#1E293B',
                borderRadius: '32px',
                padding: '6px',
                border: `2px solid ${i === active ? '#3B82F6' : 'rgba(255,255,255,0.1)'}`,
                boxShadow: i === active
                  ? '0 40px 80px rgba(59,130,246,0.5)'
                  : '0 20px 40px rgba(0,0,0,0.5)',
              }}>
                {/* Thanh trạng thái mỏng */}
                <div style={{
                  height: '8px',
                  display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
                  padding: '0 12px', marginBottom: '2px',
                }}>
                  <div style={{
                    width: '30px', height: '3px',
                    background: 'rgba(255,255,255,0.2)', borderRadius: '2px',
                  }} />
                </div>
                {/* Screen - chiếm gần hết frame */}
                <div style={{ borderRadius: '26px', overflow: 'hidden', height: '420px' }}>
                  <img
                    src={s.src} alt={s.label}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center', display: 'block' }}
                  />
                </div>
                {/* Home indicator */}
                <div style={{
                  width: '60px', height: '4px',
                  background: 'rgba(255,255,255,0.15)', borderRadius: '2px',
                  margin: '6px auto 2px',
                }} />
              </div>
            </div>
          ))}
        </div>

        {/* Label active */}
        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <div style={{ color: isDark ? 'white' : '#0F172A', fontSize: '18px', fontWeight: '700' }}>
            {screens[active].label}
          </div>
          <div style={{ color: isDark ? '#60A5FA' : '#2563EB', fontSize: '14px', marginTop: '6px' }}>
            {screens[active].desc}
          </div>
        </div>

        {/* Nút prev/next */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '24px', marginTop: '32px' }}>
          <button onClick={prev} style={{
            width: '44px', height: '44px', borderRadius: '50%',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.2)' : '#DBEAFE'}`,
            background: isDark ? 'rgba(255,255,255,0.05)' : 'white',
            color: isDark ? 'white' : '#2563EB', fontSize: '18px', cursor: 'pointer', display: 'flex',
            alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s',
          }}>‹</button>

          {/* Dots */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {screens.map((_, i) => (
              <div key={i} onClick={() => setActive(i)} style={{
                width: active === i ? '24px' : '8px', height: '8px', borderRadius: '4px',
                background: active === i ? '#3B82F6' : isDark ? 'rgba(255,255,255,0.2)' : '#DBEAFE',
                cursor: 'pointer', transition: 'all 0.3s ease',
              }} />
            ))}
          </div>

          <button onClick={next} style={{
          width: '44px', height: '44px', borderRadius: '50%',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.2)' : '#DBEAFE'}`,
          background: isDark ? 'rgba(255,255,255,0.05)' : 'white',
          color: isDark ? 'white' : '#2563EB',
          fontSize: '18px', cursor: 'pointer', display: 'flex',
          alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s',
        }}>›</button>
        </div>

      </div>
    </section>
  );
}