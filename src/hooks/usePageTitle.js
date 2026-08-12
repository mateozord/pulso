import { useEffect } from 'react'

const BRAND = 'PULSO'

/**
 * `document.title` não é estado do React — é uma propriedade do
 * `document`, fora da árvore de componentes. useEffect é o jeito
 * correto de sincronizar algo do React com uma API do navegador que
 * vive "por fora" (efeito colateral, não renderização).
 */
export function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · ${BRAND}` : `${BRAND} — A cidade toca aqui`
  }, [title])
}
