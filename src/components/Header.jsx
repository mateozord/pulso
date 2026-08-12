import { NavLink } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import './Header.css'

function Header() {
  const { user, signOut } = useAuth()
  // Contas criadas antes do campo de apelido existir não têm
  // `user_metadata.nickname` — cai pro início do e-mail nesse caso.
  const displayName = user?.user_metadata?.nickname || user?.email?.split('@')[0]

  return (
    <header className="header">
      <div className="header__inner">
        <NavLink to="/" end className="header__logo">
          PULSO
        </NavLink>
        <nav className="header__nav">
          <NavLink to="/explorar" className="header__link">
            Explorar
          </NavLink>
          <NavLink to="/favoritos" className="header__link">
            Favoritos
          </NavLink>
          {user ? (
            <span className="header__user">
              <span className="header__nickname">{displayName}</span>
              <button type="button" className="header__link header__link--button" onClick={signOut}>
                Sair
              </button>
            </span>
          ) : (
            <NavLink to="/login" className="header__link">
              Entrar
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Header
