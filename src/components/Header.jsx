import { NavLink } from 'react-router-dom'

function Header() {
  return (
    <header>
      <NavLink to="/" end>
        PULSO
      </NavLink>
      <nav>
        <NavLink to="/explorar">Explorar</NavLink>
        <NavLink to="/favoritos">Favoritos</NavLink>
      </nav>
    </header>
  )
}

export default Header
