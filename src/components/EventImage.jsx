import { useEffect, useRef, useState } from 'react'
import './EventImage.css'

/**
 * Cobre dois cenários de "sem imagem": a API não mandou nenhuma
 * (`src` vazio) e a API mandou uma URL, mas ela falha ao carregar
 * (link quebrado, CDN fora do ar). Sem o `onError`, o segundo caso
 * mostraria o ícone de imagem quebrada do navegador — com ele, cai
 * pro mesmo fallback visual da marca.
 *
 * Também faz um fade-in suave quando a imagem termina de carregar.
 * Pegadinha clássica: se a imagem já estiver no cache do navegador,
 * o evento `onLoad` pode nunca disparar (ela "carrega" antes da gente
 * conseguir escutar) — por isso checamos `img.complete` direto na
 * montagem, não só o evento.
 */
function EventImage({ src, alt = '', className, fallbackClassName, fallbackLabel = 'PULSO', loading }) {
  const [failed, setFailed] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const imgRef = useRef(null)

  useEffect(() => {
    setLoaded(false)
    setFailed(false)
    if (imgRef.current?.complete) {
      setLoaded(true)
    }
  }, [src])

  if (!src || failed) {
    return (
      <div className={fallbackClassName} aria-hidden="true">
        {fallbackLabel}
      </div>
    )
  }

  return (
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      className={`event-image ${loaded ? 'event-image--loaded' : ''} ${className ?? ''}`}
      loading={loading}
      onLoad={() => setLoaded(true)}
      onError={() => setFailed(true)}
    />
  )
}

export default EventImage
