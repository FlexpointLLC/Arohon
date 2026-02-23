const BRAND_GREEN = '#016b42';

export function PageSection({
  title,
  accent,
  subtitle,
  children,
}: {
  title: string;
  accent: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className="relative flex flex-col items-center px-6 py-[100px] md:py-[150px]"
      style={{
        backgroundColor: '#ffffff',
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.04) 1px, transparent 0)',
        backgroundSize: '24px 24px',
      }}
    >
      <div className="w-full max-w-6xl">
        <div
          className="mx-auto mb-12 w-full max-w-[990px]"
          style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
        >
          <h1
            className="font-semibold tracking-tight text-gray-900"
            style={{ fontSize: '48px', lineHeight: '100%' }}
          >
            {title}{' '}
            <span
              style={{
                color: BRAND_GREEN,
                fontWeight: 800,
                fontFamily: 'var(--font-instrument), Georgia, serif',
                fontStyle: 'italic',
                letterSpacing: '1px',
              }}
            >
              {accent}
            </span>
          </h1>
          <p className="mt-4 max-w-[600px] text-base leading-relaxed text-gray-600">{subtitle}</p>
        </div>
        {children}
      </div>
    </section>
  );
}
