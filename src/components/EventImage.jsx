import { useState } from 'react'

/**
 * Cobre dois cenários de "sem imagem": a API não mandou nenhuma
 * (`src` vazio) e a API mandou uma URL, mas ela falha ao carregar
 * (link quebrado, CDN fora do ar). Sem o `onError`, o segundo caso
 * mostraria o ícone de imagem quebrada do navegador — com ele, cai
 * pro mesmo fallback visual da marca.
 */
function EventImage({ src, alt = '', className, fallbackClassName, fallbackLabel = 'PULSO', loading }) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) {
    return (
      <div className={fallbackClassName} aria-hidden="true">
        {fallbackLabel}
      </div>
    )
  }

  return <img src={src} alt={alt} className={className} loading={loading} onError={() => setFailed(true)} />
}

export default EventImage
