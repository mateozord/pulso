import { useParams } from 'react-router-dom'

function Evento() {
  const { id } = useParams()

  return (
    <section>
      <h1>Evento</h1>
      <p>Em breve: detalhes do evento {id}.</p>
    </section>
  )
}

export default Evento
