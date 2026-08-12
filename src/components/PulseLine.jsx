import './PulseLine.css'

/**
 * O motivo visual da marca: uma linha de frequência, não um
 * equalizador. Path desenhado à mão simulando um pulso de áudio —
 * alguns trechos planos, alguns picos, como uma onda sonora real.
 */
function PulseLine({ className = '' }) {
  return (
    <svg
      className={`pulse-line ${className}`}
      viewBox="0 0 400 40"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        className="pulse-line__path"
        d="M0 20 L50 20 L64 8 L78 32 L92 20 L150 20 L166 4 L182 36 L198 20 L260 20 L272 12 L284 28 L296 20 L400 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default PulseLine
