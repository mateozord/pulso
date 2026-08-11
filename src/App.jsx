import { Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import Explorar from './pages/Explorar'
import Evento from './pages/Evento'
import Artista from './pages/Artista'
import Favoritos from './pages/Favoritos'
import './App.css'

function App() {
  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explorar" element={<Explorar />} />
          <Route path="/evento/:id" element={<Evento />} />
          <Route path="/artista/:id" element={<Artista />} />
          <Route path="/favoritos" element={<Favoritos />} />
        </Routes>
      </main>
    </>
  )
}

export default App
