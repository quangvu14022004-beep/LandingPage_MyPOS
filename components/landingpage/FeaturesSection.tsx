'use client';

import { useState, useEffect } from 'react';
import { useLang } from '@/lib/LanguageContext';
import { ShoppingCart, Home, BarChart2, DollarSign } from 'lucide-react';

export default function FeaturesSection() {
  const { t, theme } = useLang();
  const isDark = theme === 'dark';
  const [hovered, setHovered] = useState<number | null>(null);
  const [cols, setCols] = useState(4);

  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 640) setCols(1);
      else if (window.innerWidth < 1024) setCols(2);
      else setCols(4);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const features: { icon: React.ReactNode; iconLarge: React.ReactNode; title: string; desc: string; image: string; detail: string[] }[] = [
    {
      icon: <ShoppingCart size={30} color="white" />, iconLarge: <ShoppingCart size={48} color="white" />,
      title: t.features.pos.title,
      desc: t.features.pos.desc,
      image: 'https://images.unsplash.com/photo-1601598851547-4302969d0614?w=400&q=80',
      detail: [t.features.pos.d1, t.features.pos.d2, t.features.pos.d3, t.features.pos.d4, t.features.pos.d5],
    },
    {
      icon: <Home size={30} color="white" />, iconLarge: <Home size={48} color="white" />,
      title: t.features.lodging.title,
      desc: t.features.lodging.desc,
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80',
      detail: [t.features.lodging.d1, t.features.lodging.d2, t.features.lodging.d3, t.features.lodging.d4, t.features.lodging.d5],
    },
    {
      icon: <BarChart2 size={30} color="white" />, iconLarge: <BarChart2 size={48} color="white" />,
      title: t.features.report.title,
      desc: t.features.report.desc,
      image: 'https://images.unsplash.com/photo-1543286386-713bdd548da4?w=400&q=80',
      detail: [t.features.report.d1, t.features.report.d2, t.features.report.d3, t.features.report.d4, t.features.report.d5],
    },
    {
      icon: <DollarSign size={30} color="white" />, iconLarge: <DollarSign size={48} color="white" />,
      title: t.features.finance.title,
      desc: t.features.finance.desc,
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&q=80',
      detail: [t.features.finance.d1, t.features.finance.d2, t.features.finance.d3, t.features.finance.d4, t.features.finance.d5],
    },
  ];

  return (
    <section className="features" id="features" style={{
      padding: cols === 1 ? '40px 16px' : cols === 2 ? '60px 20px' : '100px 20px',
    }}>
      <div className="container">
        <div className="section-title" style={{
          marginBottom: cols === 1 ? '24px' : cols === 2 ? '40px' : '80px',
        }}>
          <h2>{t.features.title}</h2>
          <p>{t.features.desc}</p>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gap: cols === 1 ? '16px' : '24px',
          maxWidth: '1200px', margin: '0 auto',
        }}>
          {features.map((f, i) => (
            <div
              key={i}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                borderRadius: '16px',
                border: `3px solid ${hovered === i ? '#60A5FA' : (isDark ? '#363B55' : '#D4DCE6')}`,
                background: isDark ? '#2A2F45' : 'white',
                cursor: 'pointer',
                transition: 'all 0.4s ease',
                boxShadow: hovered === i ? '0 20px 60px rgba(37,99,235,0.2)' : 'none',
                transform: hovered === i ? 'translateY(-12px)' : 'none',
                overflow: 'hidden',
              }}
            >
              {/* Ảnh */}
              <div style={{ overflow: 'hidden', height: '180px', position: 'relative' }}>
                <img src={f.image} alt={f.title} style={{
                  width: '100%', height: '180px', objectFit: 'cover', display: 'block',
                  transition: 'transform 0.5s ease, filter 0.5s ease',
                  transform: hovered === i ? 'scale(1.08)' : 'scale(1)',
                  filter: hovered === i
                    ? 'brightness(0.5) saturate(2) hue-rotate(200deg) sepia(0.3)'
                    : 'brightness(1)',
                }} />
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(135deg, rgba(37,99,235,0.75), rgba(59,130,246,0.5))',
                  opacity: hovered === i ? 1 : 0,
                  transition: 'opacity 0.5s ease',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{
                    fontSize: '48px',
                    transform: hovered === i ? 'scale(1) translateY(0)' : 'scale(0) translateY(20px)',
                    transition: 'transform 0.4s ease 0.1s',
                    filter: 'drop-shadow(0 4px 16px rgba(37,99,235,0.8)) brightness(1.5)',
                    display: 'block',
                  }}>{f.iconLarge}</span>
                </div>
              </div>

              {/* Nội dung */}
              <div style={{ padding: cols === 1 ? '20px' : '32px' }}>
                <div style={{
                  width: '60px', height: '60px',
                  background: 'linear-gradient(135deg, #2563EB, #60A5FA)',
                  borderRadius: '14px', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  fontSize: '30px', marginBottom: '20px',
                  boxShadow: '0 8px 20px rgba(37,99,235,0.3)',
                  transition: 'transform 0.3s ease',
                  transform: hovered === i ? 'rotate(8deg) scale(1.1)' : 'rotate(0) scale(1)',
                }}>{f.icon}</div>

                <h3 style={{
                  fontSize: cols === 1 ? '18px' : '22px', fontWeight: '700',
                  color: hovered === i ? (isDark ? '#60A5FA' : '#2563EB') : (isDark ? '#E8EAF0' : '#0F1419'),
                  marginBottom: '10px', transition: 'color 0.3s ease',
                }}>{f.title}</h3>

                <p style={{
                  color: isDark ? '#B0BAD0' : '#5A6570',
                  lineHeight: '1.7', fontWeight: '500',
                  maxHeight: hovered === i ? '0' : '80px',
                  overflow: 'hidden',
                  opacity: hovered === i ? 0 : 1,
                  transition: 'all 0.3s ease',
                  fontSize: cols === 1 ? '14px' : '15px',
                }}>{f.desc}</p>

                <div style={{
                  maxHeight: hovered === i ? '500px' : '0',
                  overflow: 'hidden',
                  opacity: hovered === i ? 1 : 0,
                  transition: 'all 0.4s ease',
                }}>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {f.detail.map((line, j) => (
                      <li key={j} style={{
                        color: isDark ? '#E8EAF0' : '#0F1419',
                        fontSize: '14px', fontWeight: '500',
                        padding: '7px 0',
                        borderBottom: j < f.detail.length - 1
                          ? `1px solid ${isDark ? '#363B55' : '#F5F3FF'}` : 'none',
                        lineHeight: '1.6',
                        transition: `opacity 0.3s ease ${j * 0.05}s`,
                        opacity: hovered === i ? 1 : 0,
                      }}>{line}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}