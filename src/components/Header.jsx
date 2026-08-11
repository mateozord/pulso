import { NavLink } from 'react-router-dom'
import './Header.css'

function Header() {
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
        </nav>
      </div>
    </header>
  )
}

export default Header
