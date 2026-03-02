'use client';

import { useEffect } from 'react';

const BRIDGE_URL = 'https://core.sanity-cdn.com/bridge.js';

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const existing = document.querySelector(`script[src="${BRIDGE_URL}"]`);
    if (existing) return;
    const script = document.createElement('script');
    script.src = BRIDGE_URL;
    script.async = true;
    script.type = 'module';
    document.head.appendChild(script);
  }, []);

  return <>{children}</>;
}
