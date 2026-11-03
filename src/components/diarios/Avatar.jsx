export default function Avatar({ member, size = 'h-9 w-9' }) {
  const name = member?.nickname || '?'
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
  if (member?.photoURL) {
    return (
      <img
        src={member.photoURL}
        alt=""
        referrerPolicy="no-referrer"
        className={`${size} shrink-0 rounded-full bg-white/[0.06] object-cover`}
      />
    )
  }
  return (
    <span
      className={`${size} grid shrink-0 place-items-center rounded-full bg-white/[0.08] text-[12px] font-semibold text-slate-200`}
    >
      {initials}
    </span>
  )
}
