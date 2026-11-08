// Platzhalter-Titelbild (flache SVG, keine Lebewesen). Wird später durch echte Illustrationen (bild_url) ersetzt.
export default function CoverArt({ motiv }: { motiv: string }) {
  return (
    <svg viewBox="0 0 400 200" role="img" aria-label={`Titelbild: ${motiv}`} className="cover" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0e1b33" /><stop offset="1" stopColor="#2b3f66" />
        </linearGradient>
      </defs>
      <rect width="400" height="200" fill="url(#sky)" />
      {[[60, 30], [120, 60], [310, 40], [350, 80], [200, 25], [250, 70], [90, 90]].map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r="1.8" fill="#e8d28a" />
      ))}
      <circle cx="300" cy="55" r="22" fill="#e8d28a" /><circle cx="310" cy="50" r="20" fill="#1c2c4d" />
      <path d="M0 150 Q100 120 200 145 T400 135 V200 H0Z" fill="#b8975a" />
      <path d="M0 175 Q120 150 240 172 T400 165 V200 H0Z" fill="#9a7b44" />
      {/* Brunnen */}
      <g>
        <ellipse cx="200" cy="150" rx="34" ry="9" fill="#5b4526" />
        <rect x="166" y="128" width="68" height="22" fill="#8a7a62" />
        <ellipse cx="200" cy="128" rx="34" ry="9" fill="#a8977c" />
        <ellipse cx="200" cy="128" rx="26" ry="6" fill="#0b1426" />
      </g>
    </svg>
  )
}
