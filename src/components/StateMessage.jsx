import './StateMessage.css'

/**
 * Mensagem central para os estados "sem resultado" e "erro". Evitamos
 * duplicar esse bloco em cada página que consome a API.
 */
function StateMessage({ title, description, onRetry }) {
  return (
    <div className="state-message">
      <p className="state-message__title">{title}</p>
      {description && <p className="state-message__description">{description}</p>}
      {onRetry && (
        <button type="button" className="state-message__retry" onClick={onRetry}>
          Tentar de novo
        </button>
      )}
    </div>
  )
}

export default StateMessage
