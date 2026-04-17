'use client';
import { useLang } from '@/lib/LanguageContext';
import Navbar from '@/components/landingpage/Navbar';
import Footer from '@/components/landingpage/Footer';
import { Smartphone, Apple, Download, Play } from 'lucide-react';

export default function DownloadPage() {
  const { t } = useLang();

  const handleDownload = (platform: string, type?: string) => {
    let url = '';
    if (platform === 'android') {
      if (type === 'play') {
        url = 'https://play.google.com/store/apps/details?id=com.mypos.app';
      } else if (type === 'apk') {
        url = '/downloads/mypos.apk'; // Placeholder for APK download
      }
    } else if (platform === 'ios') {
      url = 'https://apps.apple.com/app/mypos/id123456789';
    }
    if (url) {
      window.open(url, '_blank');
    }
  };

  return (
    <>
      <Navbar />
      <section style={{
        marginTop: '70px',
        padding: '100px 20px',
        background: 'linear-gradient(135deg, #F5F7FA 0%, #EFF6FF 50%, #F5F7FA 100%)',
        minHeight: 'calc(100vh - 70px)',
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          textAlign: 'center',
        }}>
          <div className="badge" style={{
            fontSize: '15px',
            display: 'inline-block',
            padding: '12px 24px',
            background: 'linear-gradient(135deg, rgba(37,99,235,0.1), rgba(59,130,246,0.1))',
            color: 'var(--primary-blue)',
            border: '2px solid #DBEAFE',
            borderRadius: '50px',
            fontWeight: '700',
            marginBottom: '24px',
          }}>
            Tải xuống MyPOS
          </div>

          <h1 style={{
            fontSize: '58px',
            lineHeight: '1.2',
            margin: '24px 0',
            fontWeight: '800',
            color: 'var(--text-dark)',
          }}>
            Chọn phiên bản phù hợp với thiết bị của bạn
          </h1>

          <p style={{
            fontSize: '20px',
            color: 'var(--text-gray)',
            maxWidth: '650px',
            margin: '24px auto',
            lineHeight: '1.8',
            fontWeight: '500',
          }}>
            MyPOS - Ứng dụng quản lý điểm bán hàng thông minh. Tải xuống ngay để trải nghiệm!
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '40px',
            marginTop: '60px',
          }}>
            {/* Android Section */}
            <div style={{
              padding: '40px',
              border: '3px solid #D4DCE6',
              borderRadius: '16px',
              background: 'white',
              transition: 'all 0.4s ease',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent-cyan)';
              e.currentTarget.style.boxShadow = '0 20px 60px rgba(37,99,235,0.2)';
              e.currentTarget.style.transform = 'translateY(-12px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#D4DCE6';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.transform = 'translateY(0)';
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '24px',
              }}>
                <Smartphone size={64} color="#2563EB" />
              </div>
              <h2 style={{
                fontSize: '32px',
                marginBottom: '16px',
                color: 'var(--text-dark)',
                fontWeight: '700',
              }}>
                Android
              </h2>
              <p style={{
                fontSize: '16px',
                color: 'var(--text-gray)',
                marginBottom: '32px',
              }}>
                Tải xuống MyPOS cho thiết bị Android của bạn.
              </p>
              <p style={{
                fontSize: '14px',
                color: 'var(--primary-blue)',
                fontWeight: '600',
                marginBottom: '32px',
              }}>
                Version 1.0
              </p>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}>
                <button
                  onClick={() => handleDownload('android', 'play')}
                  style={{
                    padding: '16px 32px',
                    background: 'linear-gradient(135deg, #2563EB, #3B82F6)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    fontSize: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                    boxShadow: '0 12px 24px rgba(37,99,235,0.35)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 16px 32px rgba(37,99,235,0.45)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 12px 24px rgba(37,99,235,0.35)';
                  }}
                >
                  <Play size={20} />
                  Tải từ Google Play
                </button>
                <button
                  onClick={() => handleDownload('android', 'apk')}
                  style={{
                    padding: '16px 32px',
                    background: 'transparent',
                    color: 'var(--primary-blue)',
                    border: '2px solid var(--primary-blue)',
                    borderRadius: '12px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    fontSize: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '12px',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#EFF6FF';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <Download size={20} />
                  Tải APK
                </button>
              </div>
            </div>

            {/* iOS Section */}
            <div style={{
              padding: '40px',
              border: '3px solid #D4DCE6',
              borderRadius: '16px',
              background: 'white',
              transition: 'all 0.4s ease',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent-cyan)';
              e.currentTarget.style.boxShadow = '0 20px 60px rgba(37,99,235,0.2)';
              e.currentTarget.style.transform = 'translateY(-12px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#D4DCE6';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.transform = 'translateY(0)';
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '24px',
              }}>
                <Apple size={64} color="#2563EB" />
              </div>
              <h2 style={{
                fontSize: '32px',
                marginBottom: '16px',
                color: 'var(--text-dark)',
                fontWeight: '700',
              }}>
                iOS
              </h2>
              <p style={{
                fontSize: '16px',
                color: 'var(--text-gray)',
                marginBottom: '32px',
              }}>
                Tải xuống MyPOS cho thiết bị iOS của bạn.
              </p>
              <p style={{
                fontSize: '14px',
                color: 'var(--primary-blue)',
                fontWeight: '600',
                marginBottom: '32px',
              }}>
                Version 1.0
              </p>
              <button
                onClick={() => handleDownload('ios')}
                style={{
                  padding: '16px 32px',
                  background: 'linear-gradient(135deg, #2563EB, #3B82F6)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontSize: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  boxShadow: '0 12px 24px rgba(37,99,235,0.35)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 16px 32px rgba(37,99,235,0.45)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(37,99,235,0.35)';
                }}
              >
                <Apple size={20} />
                Tải từ App Store
              </button>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}