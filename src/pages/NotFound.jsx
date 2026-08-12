import StateMessage from '../components/StateMessage'
import { usePageTitle } from '../hooks/usePageTitle'

function NotFound() {
  usePageTitle('Página não encontrada')

  return (
    <StateMessage
      title="Essa página não existe."
      description="Confira o endereço ou volte pra explorar shows de verdade."
      actionTo="/"
      actionLabel="Voltar pra Home"
    />
  )
}

export default NotFound
