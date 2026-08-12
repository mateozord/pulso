import { Link } from 'react-router-dom'
import './StateMessage.css'

/**
 * Mensagem central para os estados "sem resultado", "erro" e "não
 * encontrado". `onRetry` faz sentido pra erro (tentar de novo pode
 * funcionar); `actionTo`/`actionLabel` fazem sentido pra "não
 * encontrado" (não existe "tentar de novo" pra um evento que não existe).
 */
function StateMessage({ title, description, onRetry, actionTo, actionLabel }) {
  return (
    <div className="state-message">
      <p className="state-message__title">{title}</p>
      {description && <p className="state-message__description">{description}</p>}
      {onRetry && (
        <button type="button" className="state-message__retry" onClick={onRetry}>
          Tentar de novo
        </button>
      )}
      {actionTo && (
        <Link to={actionTo} className="state-message__retry">
          {actionLabel}
        </Link>
      )}
    </div>
  )
}

export default StateMessage
