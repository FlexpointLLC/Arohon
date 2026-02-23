'use client';

import { useParams } from 'next/navigation';
import { useEffect } from 'react';

export default function TrackPage() {
  const params = useParams();
  const id = (params?.id as string) || '';
  const rideId = id.trim();
  const appScheme = rideId ? `arohon-customer://track/${rideId}` : '';

  useEffect(() => {
    if (appScheme) window.location.replace(appScheme);
  }, [appScheme]);

  if (!rideId) return null;

  return (
    <>
      <style>{`
        @keyframes pulse-soft {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .track-spinner {
          animation: spin 1s linear infinite;
        }
        .track-pulse {
          animation: pulse-soft 1.5s ease-in-out infinite;
        }
      `}</style>
      <main
        className="relative flex min-h-[calc(100vh+12px)] w-[calc(100%+12px)] -m-[6px] flex-col items-center justify-center overflow-hidden p-6 sm:min-h-[calc(100vh+16px)] sm:w-[calc(100%+16px)] sm:-m-2"
        style={{
          fontFamily: 'system-ui, -apple-system, sans-serif',
          background: '#0f172a',
          color: '#f1f5f9',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse 80% 60% at 50% -20%, rgba(10, 191, 139, 0.2), transparent)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '400px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              margin: '0 auto 1.5rem',
              borderRadius: '50%',
              background: 'rgba(10, 191, 139, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg
              className="track-spinner"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#0ABF8B"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ flexShrink: 0 }}
            >
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
          </div>
          <img
            src="/logo.svg"
            alt="Arohon"
            style={{
              height: '144px',
              width: 'auto',
              marginBottom: '0.25rem',
              display: 'block',
            }}
          />
          <p
            className="track-pulse"
            style={{
              fontSize: '0.9375rem',
              color: '#94a3b8',
              marginBottom: '1.75rem',
            }}
          >
            Opening app…
          </p>
          <a
            href={appScheme}
            style={{
              display: 'inline-block',
              padding: '0.75rem 1.5rem',
              fontSize: '0.9375rem',
              fontWeight: 600,
              color: '#fff',
              background: '#0ABF8B',
              borderRadius: '0.75rem',
              textDecoration: 'none',
              transition: 'opacity 0.2s, transform 0.15s',
              boxShadow: '0 4px 14px rgba(10, 191, 139, 0.35)',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.opacity = '0.9';
              e.currentTarget.style.transform = 'scale(1.02)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.opacity = '1';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            Tap here if the app didn’t open
          </a>
        </div>
      </main>
    </>
  );
}
