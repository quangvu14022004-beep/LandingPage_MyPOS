'use client';
import { useLang } from '@/lib/LanguageContext';
import { Download } from 'lucide-react';

export default function CTASection() {
  const { t } = useLang();
  return (
    <section className="cta" id="about">
      <div className="cta-content">
        <h2>{t.cta.title}</h2>
        <p>{t.cta.desc}</p>
        <div className="cta-buttons">
          <button className="btn-primary" onClick={() => window.location.href = '/register'}>{t.cta.btnRegister}</button>
          <button className="btn-secondary btn-download" onClick={() => window.location.href = '/download'}>
            <Download size={18} style={{ marginRight: '8px' }} />
            Tải về
          </button>
          <button className="btn-secondary">{t.cta.btnContact}</button>
        </div>
      </div>
    </section>
  );
}