import StateMessage from '../components/StateMessage'

function NotFound() {
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
