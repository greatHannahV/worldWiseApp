import { useNavigate, useSearchParams } from 'react-router-dom'
import styles from './Map.module.css'
function Map() {
  const navigate = useNavigate()
  const [searchParams, getSearchParams] = useSearchParams()
  const lat = searchParams.get('lat')
  const lng = searchParams.get('lng')
  return (
    <div
      className={styles.mapContainer}
      onClick={() => {
        navigate('form')
      }}
    >
      <h1>Map</h1>
      <h1>
        position: {lat},{lng}
      </h1>
      <button onClick={() => getSearchParams({ lat: 50, lng: 20 })}>
        change position
      </button>
    </div>
  )
}

export default Map
