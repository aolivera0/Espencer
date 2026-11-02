const SIZE = 184
const STROKE = 20
const RADIUS = (SIZE - STROKE) / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS
const GAP = 3

export default function DonutChart({ segments, label, children }) {
  const positive = segments.map((segment) => ({ ...segment, value: Math.max(segment.value, 0) }))
  const total = positive.reduce((sum, segment) => sum + segment.value, 0)
  const lengths = positive.map((segment) =>
    total > 0 ? (segment.value / total) * CIRCUMFERENCE : 0,
  )
  const offsets = lengths.map((_, index) =>
    lengths.slice(0, index).reduce((sum, length) => sum + length, 0),
  )
  const visible = positive.filter((segment) => segment.value > 0).length

  return (
    <div className="relative mx-auto h-[184px] w-[184px]">
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        role="img"
        aria-label={label}
        className="h-full w-full -rotate-90"
      >
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          strokeWidth={STROKE}
          className="stroke-white/[0.06]"
        />
        {positive.map((segment, index) => {
          const dash = Math.max(lengths[index] - (visible > 1 ? GAP : 0), 0)
          return (
            <circle
              key={segment.name}
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              fill="none"
              strokeWidth={STROKE}
              strokeDasharray={`${dash} ${CIRCUMFERENCE}`}
              strokeDashoffset={-offsets[index]}
              className={`${segment.stroke} transition-[stroke-dasharray] duration-700`}
            />
          )
        })}
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">{children}</div>
    </div>
  )
}
