import { useParams } from 'react-router-dom'

function Artista() {
  const { id } = useParams()

  return (
    <section>
      <h1>Artista</h1>
      <p>Em breve: perfil do artista {id}.</p>
    </section>
  )
}

export default Artista
