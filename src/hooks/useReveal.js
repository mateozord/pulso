import { useEffect, useRef, useState } from 'react'

/**
 * Observa quando um elemento entra na viewport e vira `visible` uma
 * única vez (não fica entrando/saindo a cada scroll — seria
 * cansativo, não elegante). IntersectionObserver é a API do
 * navegador feita exatamente pra isso: perguntar "esse elemento está
 * visível?" sem escutar o evento de scroll o tempo todo (o que seria
 * caro de rodar a cada pixel rolado).
 */
export function useReveal() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!('IntersectionObserver' in window) || prefersReducedMotion) {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return { ref, visible }
}
