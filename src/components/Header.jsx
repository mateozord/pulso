import { NavLink } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import './Header.css'

function Header() {
  const { user, signOut } = useAuth()

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
            <button type="button" className="header__link header__link--button" onClick={signOut}>
              Sair
            </button>
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
