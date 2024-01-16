import { createContext, useState, useEffect, useContext } from 'react'

const CitiesContext = createContext()
const BASE_URL = 'http://localhost:9000'

function CitiesProvider({ children }) {
  const [cities, setCities] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  useEffect(
    function () {
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
    },
    [setCities],
  )
  return (
    <div>
      <CitiesContext.Provider value={{ cities, setCities, isLoading }}>
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
