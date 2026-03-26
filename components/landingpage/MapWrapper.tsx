'use client';

import dynamic from 'next/dynamic';

const MapSection = dynamic(() => import('@/components/landingpage/MapSection'), {
  ssr: false,
  loading: () => (
    <div style={{ padding: '100px 20px', textAlign: 'center', color: '#5A6570' }}>
      Đang tải bản đồ...
    </div>
  ),
});

export default function MapWrapper() {
  return <MapSection />;
}