'use client';

import { useEffect, useState } from 'react';
import { useLang } from '@/lib/LanguageContext';
import { Gift } from 'lucide-react';

type Store = {
  _id: string;
  name: string;
  address: string;
  city: string;
  lat: number | null;
  lng: number | null;
  businessType: string;
};

export default function MapSection() {
  const [stores, setStores] = useState<Store[]>([]);
  const { t } = useLang();

  useEffect(() => {
    fetch('https://myposapi.onrender.com/api/shops')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.data)) {
          setStores(data.data);
        }
      })
      .catch(err => console.error('Lỗi lấy shops:', err));
  }, []);

  useEffect(() => {
    if (stores.length === 0) return;

    import('leaflet').then((L) => {
      const leaflet = L.default;
      const container = document.getElementById('map') as HTMLElement & { _leaflet_id?: number };
      if (!container || container._leaflet_id) return;

      const map = leaflet.map('map', {
        center: [16.0, 108.0],
        zoom: 5.2,
        minZoom: 4,
        maxZoom: 17,
        zoomControl: true,
        scrollWheelZoom: false,
        dragging: false,
        doubleClickZoom: false,
        boxZoom: false,
        keyboard: false,
        touchZoom: false,
        maxBounds: [[7.0, 101.0], [23.5, 110.0]],
        maxBoundsViscosity: 1.0,
      });

      leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      // - Hoàng Sa
      leaflet.polygon([
        [20.0, 111.5], [20.0, 116.5],
        [15.5, 116.5], [15.5, 111.5],
      ], {
        color: 'transparent', fillColor: '#AAD3DF',
        fillOpacity: 1, interactive: false,
      }).addTo(map);

      //  - Trường Sa
        leaflet.polygon([
          [12.0, 111.5], [12.0, 116.5],
          [7.0,  116.5], [7.0,  111.5],
        ], {
          color: 'transparent', fillColor: '#AAD3DF',
          fillOpacity: 1, interactive: false,
        }).addTo(map);

      // Click vào map → enable zoom/drag
      map.on('click', () => {
        map.scrollWheelZoom.enable();
        map.dragging.enable();
      });

      // Click ra ngoài → disable
      document.addEventListener('click', (e) => {
        const mapEl = document.getElementById('map');
        if (mapEl && !mapEl.contains(e.target as Node)) {
          map.scrollWheelZoom.disable();
          map.dragging.disable();
        }
      });

      // Custom icon
      const customIcon = leaflet.divIcon({
        html: `<svg width="24" height="35" viewBox="0 0 45 65" style="filter:drop-shadow(0 2px 4px rgba(0,0,0,0.3))">
          <path d="M22.5 0C10 0 0 10 0 22.5C0 40 22.5 65 22.5 65S45 40 45 22.5C45 10 35 0 22.5 0Z" fill="#2563EB" stroke="#1D4ED8" stroke-width="1.5"/>
          <circle cx="22.5" cy="22.5" r="10" fill="white" opacity="0.95"/>
        </svg>`,
        iconSize: [24, 35], iconAnchor: [12, 35],
        popupAnchor: [0, -35], className: '',
      });

      // Store markers
const validStores = stores
  .filter((s): s is Store & { lat: number; lng: number } =>
    s.lat !== null && s.lng !== null &&
    typeof s.lat === 'number' && typeof s.lng === 'number'
  );

    validStores.forEach((store) => {
      const latlng: [number, number] = [store.lat, store.lng];
      leaflet.marker(latlng, { icon: customIcon })
        .bindPopup(`
          <div style="padding:12px;font-weight:600;min-width:180px">
            <h4 style="color:#2563EB;margin-bottom:8px;font-size:14px">✓ ${store.name}</h4>
            <p style="color:#666;font-size:13px;margin:0">
              <strong>Loại:</strong> ${store.businessType}<br/>
              <strong>Địa chỉ:</strong> ${store.address}, ${store.city}
            </p>
          </div>`)
        .addTo(map);
    });

      // Quần đảo Hoàng Sa
      leaflet.marker([16.5, 112.0], {
        icon: leaflet.divIcon({
          html: `<div style="color:#1a5276;font-size:11px;font-weight:700;font-style:italic;white-space:nowrap;text-shadow:0 0 4px white,0 0 4px white">Quần đảo Hoàng Sa</div>`,
          className: '', iconAnchor: [60, 8],
        }), interactive: false,
      }).addTo(map);

      // Quần đảo Trường Sa
      leaflet.marker([8.65, 114.3], {
        icon: leaflet.divIcon({
          html: `<div style="color:#1a5276;font-size:11px;font-weight:700;font-style:italic;white-space:nowrap;text-shadow:0 0 4px white,0 0 4px white">Quần đảo Trường Sa</div>`,
          className: '', iconAnchor: [60, 8],
        }), interactive: false,
      }).addTo(map);

      // Biển Đông
      leaflet.marker([13.0, 113.5], {
        icon: leaflet.divIcon({
          html: `<div style="color:#2c6e8a;font-size:14px;font-weight:700;font-style:italic;white-space:nowrap;letter-spacing:0.5px;text-shadow:0 0 5px white,0 0 5px white">Biển Đông</div>`,
          className: '', iconAnchor: [35, 10],
        }), interactive: false,
      }).addTo(map);
    });
  }, [stores]);

  return (
    <section className="map-section" id="map-section">
      <div className="container">
        <div className="section-title" style={{ marginBottom: '24px' }}>
          <h2>{t.map.title}</h2>
          <p>{t.map.desc}</p>
        </div>

        <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '20px' }}>
          <div id="map" style={{
            width: '100%', height: '500px',
            borderRadius: '20px',
            border: '4px solid #2563EB',
            boxShadow: '0 24px 56px rgba(37,99,235,0.25)',
          }} />
          {/* Hint */}
          <div style={{
            position: 'absolute', bottom: '60px', left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0,0,0,0.65)', color: 'white',
            padding: '8px 20px', borderRadius: '20px',
            fontSize: '13px', fontWeight: '600',
            pointerEvents: 'none', zIndex: 999,
            whiteSpace: 'nowrap',
          }}>
            {t.map.hint}
          </div>
        </div>

        <div className="map-info">
          <h3>{t.map.info}</h3>
          <p style={{ wordBreak: 'break-word', lineHeight: '1.8' }}>
            Hà Nội • Hải Phòng • Thanh Hóa • Nghệ An • Quảng Bình • Quảng Trị • Huế • Đà Nẵng • Quảng Nam • Bình Định • Nha Trang • TP.HCM • Cần Thơ • Cà Mau
          </p>
        </div>

        <div style={{
          marginTop: '32px',
          background: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)',
          borderRadius: '20px', padding: '40px',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: '20px', textAlign: 'center',
          boxShadow: '0 20px 48px rgba(37,99,235,0.3)',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '64px', height: '64px',
              background: 'rgba(255,255,255,0.2)', borderRadius: '16px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Gift size={32} color="white" />
              </div>
            <div>
              <h3 style={{
                fontSize: '22px', fontWeight: '800',
                color: 'white', marginBottom: '8px', textAlign: 'center',
              }}>{t.map.trialTitle}</h3>
              <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.9)', fontWeight: '500' }}>
                {t.map.trialDesc}
              </p>
            </div>
          </div>
          <a href="/register" style={{ textDecoration: 'none' }}>
            <button style={{
              padding: '16px 40px', background: 'white',
              color: '#2563EB', border: 'none', borderRadius: '12px',
              fontSize: '16px', fontWeight: '800', cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
              transition: 'all 0.3s ease', whiteSpace: 'nowrap',
            }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-3px)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              {t.map.trialBtn}
            </button>
          </a>
        </div>
      </div>
    </section>
  );
}