import paths from './logoPaths.json';

// Vector logo from the customer app's brand paths (mark 41x38 + wordmark 135x38).
export function Logo({ tone = 'dark', className = 'h-7' }: { tone?: 'dark' | 'light'; className?: string }) {
  const ink = tone === 'light' ? '#FFFFFF' : '#0E121B';
  return (
    <svg viewBox="0 0 182 38" className={className} role="img" aria-label="Arohon">
      <g fill="#0ABF8B">
        {paths.mark.map((d) => (
          <path key={d.slice(0, 12)} d={d} />
        ))}
      </g>
      <g fill={ink} fillRule="evenodd" transform="translate(47 0)">
        {paths.word.map((d) => (
          <path key={d.slice(0, 16)} d={d} />
        ))}
      </g>
    </svg>
  );
}
