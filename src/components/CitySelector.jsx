import './CitySelector.css'

export const CITIES = [
  'São Paulo',
  'Rio de Janeiro',
  'Belo Horizonte',
  'Curitiba',
  'Porto Alegre',
  'Salvador',
  'Recife',
  'Brasília',
]

function CitySelector({ value, onChange, allowAll = false }) {
  return (
    <select
      className="city-selector"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      aria-label="Cidade"
    >
      {allowAll && <option value="">Todas as cidades</option>}
      {CITIES.map((city) => (
        <option key={city} value={city}>
          {city}
        </option>
      ))}
    </select>
  )
}

export default CitySelector
