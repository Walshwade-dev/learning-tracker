export default function CircularProgress({ percentage, color, size = 70 }) {
  const radius = (size - 10) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - Math.min(percentage, 100) / 100)

  const STROKE_COLOR = {
    blue: '#3b82f6',
    green: '#22c55e',
    red: '#ef4444'
  }

  return (
    <div className="relative flex items-center justify-center " style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className="-rotate-90"
      >
        {/* Background track */}
        <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth={5}
        />
        {/* Progress ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={STROKE_COLOR[color]}
          strokeWidth={5}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
      </svg>
      {/* Percentage text in center */}
      <span className="absolute text-xs font-bold text-white/90 rotate-0 shadow-2xl">
        {Math.round(Math.min(percentage, 100))}%
      </span>
    </div>
  )
}