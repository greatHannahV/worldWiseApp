import {
  createContext,
  useEffect,
  useContext,
  useReducer,
  useCallback,
} from 'react'

const CitiesContext = createContext()
const BASE_URL = 'http://localhost:8000'

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: '',
}
function reducer(state, action) {
  switch (action.type) {
    case 'loading':
      return {
        ...state,
        isLoading: true,
      }
    case 'city/loaded':
      return {
        ...state,
        isLoading: false,
        currentCity: action.payload,
      }
    case 'cities/loaded':
      return {
        ...state,
        isLoading: false,
        cities: action.payload,
      }

    case 'city/created':
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      }
    case 'city/deleted':
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
        currentCity: {},
      }
    case 'rejected':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      }

    default:
      throw new Error('Unknown action type')
  }
}
function CitiesProvider({ children }) {
  const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(
    reducer,
    initialState,
  )
  // const [cities, setCities] = useState([])
  // const [isLoading, setIsLoading] = useState(false)
  // const [currentCity, setCurrentCity] = useState({})

  useEffect(function () {
    async function fetchCities() {
      dispatch({ type: 'loading' })

      try {
        // setIsLoading(true)
        const res = await fetch(`${BASE_URL}/cities`)
        const data = await res.json()
        // console.log(data)
        // setCities(data)
        dispatch({ type: 'cities/loaded', payload: data })
      } catch {
        // alert('there was an error')
        dispatch({
          type: 'rejected',
          payload: 'there was an error loading cities data',
        })
      }
      // finally {
      //   setIsLoading(false)
      // }
    }
    fetchCities()
  }, [])

  const getCity = useCallback(
    async function getCity(id) {
      if (id === currentCity.id) return
      dispatch({ type: 'loading' })

      try {
        // setIsLoading(true)
        const res = await fetch(`${BASE_URL}/cities/${id}`)
        const data = await res.json()
        // setCurrentCity(data)
        dispatch({ type: 'city/loaded', payload: data })
      } catch (error) {
        dispatch({
          type: 'rejected',
          payload: 'Error loading a city data:',
        })
        // console.log('Error loading data:', error)
      }
      // finally {
      //   setIsLoading(false)
      // }
    },
    [currentCity.id],
  )

  async function createCity(newCity) {
    dispatch({ type: 'loading' })
    try {
      // setIsLoading(true)

      const res = await fetch(`${BASE_URL}/cities`, {
        method: 'POST',
        body: JSON.stringify(newCity),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await res.json()
      // setCities((cities) => [...cities, data])
      dispatch({ type: 'city/created', payload: data })
    } catch (error) {
      // console.log('Error creating the city:', error)
      dispatch({
        type: 'rejected',
        payload: 'Error creating the city',
      })
    }
    // finally {
    //   setIsLoading(false)
    // }
  }
  async function deleteCity(id) {
    dispatch({ type: 'loading' })
    try {
      // setIsLoading(true)

      await fetch(`${BASE_URL}/cities/${id}`, {
        method: 'DELETE',
      })
      dispatch({ type: 'city/deleted', payload: id })
      // setCities((cities) => cities.filter((city) => city.id !== id))
    } catch (error) {
      // alert('There was an error deleting the city:', error)
      dispatch({
        type: 'rejected',
        payload: 'here was an error deleting the city',
      })
    }
    // finally {
    //   setIsLoading(false)
    // }
  }

  return (
    <div>
      <CitiesContext.Provider
        value={{
          cities,
          isLoading,
          currentCity,
          error,
          getCity,
          createCity,
          deleteCity,
        }}
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
