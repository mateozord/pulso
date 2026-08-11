import { useMemo, useState } from 'react'
import { debounce } from '../utils/debounce'
import './SearchBar.css'

function SearchBar({ onSearch, placeholder = 'Buscar artista, show ou lugar...' }) {
  const [value, setValue] = useState('')

  // useMemo garante que a mesma função "debounced" seja reaproveitada
  // entre renders — se recriássemos a cada digitação, o debounce nunca
  // teria efeito (cada chamada criaria um timer novo, cancelando o
  // anterior de um "clearTimeout" diferente).
  const debouncedSearch = useMemo(() => debounce(onSearch, 400), [onSearch])

  function handleChange(event) {
    const nextValue = event.target.value
    setValue(nextValue)
    debouncedSearch(nextValue)
  }

  return (
    <input
      type="search"
      className="search-bar"
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      aria-label="Buscar"
    />
  )
}

export default SearchBar
