type StampProps = {
  date: string
  name: string
  className?: string
}

/** レビューで押す日付印。「できること」の表を最後に確かめた日を入れる */
export function Stamp({ date, name, className = '' }: StampProps) {
  return (
    <svg viewBox="0 0 120 120" className={`stamp ${className}`} role="img" aria-label={`検証済 ${date} ${name}`}>
      <g fill="none" stroke="currentColor">
        <circle cx="60" cy="60" r="55" strokeWidth="3.5" />
        <path d="M7.6 44H112.4M7.6 76H112.4" strokeWidth="2.5" />
      </g>
      <g fill="currentColor" textAnchor="middle" fontWeight="700">
        <text x="61" y="35" fontSize="19" letterSpacing="2" className="font-seal">
          検証済
        </text>
        <text x="60" y="66" fontSize="15.5">
          {date}
        </text>
        <text x="60" y="98" fontSize="15.5">
          {name}
        </text>
      </g>
    </svg>
  )
}
