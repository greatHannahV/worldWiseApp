import { createContext, useState, useEffect, useContext } from 'react'

const CitiesContext = createContext()
const BASE_URL = 'http://localhost:8000'

function CitiesProvider({ children }) {
  const [cities, setCities] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentCity, setCurrentCity] = useState({})

  useEffect(function () {
    async function fetchCities() {
      try {
        setIsLoading(true)
        const res = await fetch(`${BASE_URL}/cities`)
        const data = await res.json()
        // console.log(data)
        setCities(data)
      } catch {
        alert('there was an error')
      } finally {
        setIsLoading(false)
      }
    }
    fetchCities()
  }, [])

  async function getCity(id) {
    try {
      setIsLoading(true)
      const res = await fetch(`${BASE_URL}/cities/${id}`)
      const data = await res.json()
      setCurrentCity(data)
    } catch (error) {
      console.log('Error loading data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <CitiesContext.Provider
        value={{ cities, isLoading, currentCity, getCity }}
      >
        {children}
      </CitiesContext.Provider>
    </div>
  )
}

function useCities() {
  const context = useContext(CitiesContext)
  if (context === undefined) throw new Error('Outside of the provider')

  return context
}
export { CitiesProvider, useCities }
