import { useEffect, useRef, useState } from 'react'
import './Dropdown.css'

/**
 * Substitui o `<select>` nativo. O motivo: o menu aberto de um select
 * é desenhado pelo sistema operacional, não pela página — CSS não
 * alcança ele (fica com fundo branco, fonte do sistema, etc, fora do
 * tema do app, nesse app dark theme). Este componente reconstrói o
 * comportamento (abre/fecha, seleciona, fecha ao clicar fora ou
 * apertar Esc) inteiramente com HTML/CSS nossos.
 */
function Dropdown({ value, onChange, options, ariaLabel, className = '' }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return

    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false)
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  const selected = options.find((option) => option.value === value)

  return (
    <div className={`dropdown ${className}`} ref={ref}>
      <button
        type="button"
        className="dropdown__trigger"
        onClick={() => setOpen((current) => !current)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
      >
        <span>{selected?.label ?? ariaLabel}</span>
        <svg className="dropdown__chevron" viewBox="0 0 20 20" aria-hidden="true">
          <path d="M5 8l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {open && (
        <ul className="dropdown__list" role="listbox" aria-label={ariaLabel}>
          {options.map((option) => (
            <li key={option.value} role="option" aria-selected={option.value === value}>
              <button
                type="button"
                className={`dropdown__option ${option.value === value ? 'dropdown__option--active' : ''}`}
                onClick={() => {
                  onChange(option.value)
                  setOpen(false)
                }}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Dropdown
