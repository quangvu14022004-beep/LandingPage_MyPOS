'use client';

import { useEffect, useState } from 'react';
import { useLang } from '@/lib/LanguageContext';
import { ShoppingCart, TrendingUp } from 'lucide-react';

export default function HeroSection() {
  const { t } = useLang();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return (
    <section className="hero">
      <div style={{
        maxWidth: '1200px', margin: '0 auto',
        display: 'flex', alignItems: 'center',
        gap: isMobile ? '32px' : '60px',
        flexDirection: isMobile ? 'column' : 'row',
        padding: isMobile ? '0 4px' : '0',
      }}>
        {/* Nội dung trái */}
        <div style={{
          flex: '1', minWidth: '0',
          textAlign: isMobile ? 'center' : 'left',
          width: '100%',
        }}>
          <div className="badge" style={{ fontSize: isMobile ? '13px' : '15px' }}>
            {t.hero.badge}
          </div>

          <h1 style={{
            fontSize: isMobile ? '36px' : '58px',
            lineHeight: '1.2', margin: '16px 0',
            fontWeight: '800', color: '#0F1419',
          }}>
            {t.hero.title1}<br />
            <span style={{
              background: 'linear-gradient(135deg, #2563EB, #3B82F6)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>{t.hero.title2}</span><br />
            {t.hero.title3}
          </h1>

          <p style={{
            fontSize: isMobile ? '15px' : '18px',
            color: '#5A6570', lineHeight: '1.8',
            fontWeight: '500', marginBottom: '32px',
          }}>
            {t.hero.desc}
          </p>

          <div style={{
            display: 'flex', gap: '12px', flexWrap: 'wrap',
            justifyContent: isMobile ? 'center' : 'flex-start',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'center' : 'flex-start',
}}>
            <a href="/register" style={{ textDecoration: 'none', width: isMobile ? '100%' : 'auto', maxWidth: isMobile ? '320px' : 'none' }}>
              <button className="btn-primary" style={{
                padding: isMobile ? '14px 28px' : '16px 36px',
                fontSize: isMobile ? '15px' : '16px',
                width: '100%',
                boxSizing: 'border-box',
              }}>
                {t.hero.btnStart}
              </button>
            </a>
          </div>

          {/* Stats nhỏ */}
          <div style={{
            display: 'flex', gap: isMobile ? '16px' : '24px',
            marginTop: '32px', flexWrap: 'wrap',
            justifyContent: isMobile ? 'center' : 'flex-start',
          }}>
            {[
              { number: '50+', label: t.hero.stores },
              { number: '100%', label: t.hero.offline },
              { number: '3', label: t.hero.language },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: isMobile ? '20px' : '24px', fontWeight: '800',
                  background: 'linear-gradient(135deg, #2563EB, #3B82F6)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                }}>{s.number}</div>
                <div style={{ fontSize: '13px', color: '#5A6570', fontWeight: '600' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Ảnh phải — ẩn trên mobile nhỏ */}
        {!isMobile && (
          <div style={{ flex: '1', minWidth: '0', position: 'relative' }}>
            <div style={{
              borderRadius: '20px', overflow: 'hidden',
              boxShadow: '0 32px 64px rgba(37,99,235,0.25)',
              border: '4px solid #DBEAFE',
            }}>
              <img
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80"
                alt="myPOS"
                style={{ width: '100%', height: '380px', objectFit: 'cover', display: 'block' }}
              />
            </div>
            {/* Badge trên */}
            <div style={{
              position: 'absolute', top: '-16px', left: '-16px',
              background: 'white', borderRadius: '16px', padding: '14px 20px',
              boxShadow: '0 8px 24px rgba(37,99,235,0.2)',
              border: '2px solid #DBEAFE',
              display: 'flex', alignItems: 'center', gap: '10px',
            }}>
              <ShoppingCart size={24} color="#0F1419" />
              <div>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#0F1419' }}>{t.hero.newOrder}</div>
                <div style={{ fontSize: '12px', color: '#00A854', fontWeight: '600' }}>{t.hero.today}</div>
              </div>
            </div>
            {/* Badge dưới */}
            <div style={{
              position: 'absolute', bottom: '-16px', right: '-16px',
              background: 'linear-gradient(135deg, #2563EB, #3B82F6)',
              borderRadius: '16px', padding: '14px 20px',
              boxShadow: '0 8px 24px rgba(37,99,235,0.4)',
              display: 'flex', alignItems: 'center', gap: '10px',
            }}>
              <TrendingUp size={24} color="white" />
              <div>
                <div style={{ fontSize: '13px', fontWeight: '700', color: 'white' }}>{t.hero.revenue}</div>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.9)', fontWeight: '600' }}>{t.hero.growth}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}