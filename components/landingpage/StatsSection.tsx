'use client';
import { useLang } from '@/lib/LanguageContext';

export default function StatsSection() {
  const { t } = useLang();
  return (
    <section className="stats">
      <div className="stats-container">
        {[
          { number: '50+', label: t.stats.stores },
          { number: '100%', label: t.stats.offline },
          { number: '3', label: t.stats.lang },
        ].map((s, i) => (
          <div className="stat" key={i}>
            <div className="stat-number">{s.number}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}