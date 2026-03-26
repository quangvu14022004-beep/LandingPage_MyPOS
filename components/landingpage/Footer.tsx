'use client';
import Link from 'next/link';
import { useLang } from '@/lib/LanguageContext';

export default function Footer() {
  const { t } = useLang();
  return (
    <footer>
      <div className="footer-grid">
        <div className="footer-section">
          <h3>myPOS</h3>
          <p>{t.footer.desc}</p>
        </div>
        <div className="footer-section">
          <h3>{t.footer.product}</h3>
          <ul>
            <li><Link href="#">{t.footer.features}</Link></li>
            <li><Link href="#">{t.footer.pricing}</Link></li>
            <li><Link href="#">{t.footer.download}</Link></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>{t.footer.company}</h3>
          <ul>
            <li><Link href="#">{t.footer.about}</Link></li>
            <li><Link href="#">{t.footer.blog}</Link></li>
            <li><Link href="#">{t.footer.contact}</Link></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>{t.footer.legal}</h3>
          <ul>
            <li><Link href="#">{t.footer.terms}</Link></li>
            <li><Link href="#">{t.footer.privacy}</Link></li>
            <li><Link href="#">{t.footer.cookie}</Link></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>{t.footer.copyright}</p>
      </div>
    </footer>
  );
}