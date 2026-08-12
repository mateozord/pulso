import { CITIES } from '../utils/cities'
import Dropdown from './Dropdown'

function CitySelector({ value, onChange, allowAll = false }) {
  const options = [
    ...(allowAll ? [{ value: '', label: 'Todas as cidades' }] : []),
    ...CITIES.map((city) => ({ value: city, label: city })),
  ]

  return (
    <Dropdown value={value} onChange={onChange} options={options} ariaLabel="Cidade" className="city-selector" />
  )
}

export default CitySelector
