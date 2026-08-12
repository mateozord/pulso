import { useReveal } from '../hooks/useReveal'
import './Reveal.css'

/**
 * `as` deixa escolher a tag renderizada (ex.: "section", "article")
 * — importante pra não perder a semântica/acessibilidade trocando uma
 * <section> por uma <div> só pra poder animar.
 */
function Reveal({ children, className = '', as: Tag = 'div' }) {
  const { ref, visible } = useReveal()

  return (
    <Tag ref={ref} className={`reveal ${visible ? 'reveal--visible' : ''} ${className}`}>
      {children}
    </Tag>
  )
}

export default Reveal
