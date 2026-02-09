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
    <main style={{ fontFamily: 'system-ui', padding: '2rem', textAlign: 'center' }}>
      <p>Opening Arohon app…</p>
      <p>
        <a href={appScheme} style={{ color: '#0ABF8B', fontWeight: 600 }}>
          Tap here if the app didn’t open
        </a>
      </p>
    </main>
  );
}
