import { useState, useEffect } from 'react'
import axios from 'axios'

const Weather = ({ capitalName }) => {
  const apiKey = import.meta.env.VITE_WEATHER_API
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${capitalName}&appid=${apiKey}&units=metric`
  const [capWeather, setCapWeather] = useState({ temp: '', wind: '' })
  const [icon, setIcon] = useState(null)


  useEffect(() => {
    axios
      .get(apiUrl)
      .then(response => {
        const temp = response.data.main.temp
        const wind = response.data.wind.speed
        const iconCode = response.data.weather[0].icon
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`
        setCapWeather({ temp, wind })
        setIcon(iconUrl)
      })
  }, [capitalName, apiKey])



  return (
    <div>
      <h2>Weather in {capitalName}</h2>
      <p>Temp: {capWeather.temp} Celcius</p>
      <img src={icon} width="100" />
      <p>Wind: {capWeather.wind} m/s</p>
    </div>
  )
}

const SearchForm = ({ searchStr, handleSearch }) => (
  <div>
    <form>
      <label>
        find countries:{' '} <input
          type="text"
          value={searchStr}
          onChange={handleSearch}
        />
      </label>
    </form>
  </div>
)

const CountryInfo = ({ country }) => (
  <div>
    <h2>{country.name.common}</h2>

    <div>
      <Capital capital={country.capital} />
      area: {country.area}
    </div>

    <h3>Languages:</h3>
    <ul>
      {Object.entries(country.languages).map(([key, value]) => (
        <li key={key}>{value}</li>
      ))}
    </ul>

    <Flag flags={country.flags} />
    <Weather capitalName={country.capital} />
  </div>
)

const Capital = ({ capital }) => {
  if (capital.length > 1) {
    return (
      <div>
        capitals:
        <ul>
          {capital.map(cap => (
            <li key={cap}>{cap}</li>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <div>capital: {capital}</div>
  )
}

const Flag = ({ flags }) => (
  <div>
    <img src={flags.svg} alt={flags.alt} width="320" />
  </div>
)


const DisplayCountries = ({ countries, searchStr }) => {
  const [filteredCountries, setFilteredCountries] = useState([])
  const [selectedCountry, setSelectedCountry] = useState(null)

  useEffect(() => {
    if (searchStr.length > 0) {
      const filtered = countries.filter(country =>
        country.name.common.toLowerCase()
          .includes(searchStr.toLowerCase())
      )
      setFilteredCountries(filtered)
      setSelectedCountry(null)
    } else {
      setFilteredCountries([])
      setSelectedCountry(null)
    }
  }, [searchStr, countries])

  if (selectedCountry) {
    return <CountryInfo country={selectedCountry} />
  }

  if (filteredCountries.length > 10) {
    return (
      <div>
        <p>Too many matches, specify another filter</p>
      </div>
    )
  }

  if (filteredCountries.length === 1) {
    return <CountryInfo country={filteredCountries[0]} />
  }

  return (
    <div>
      {filteredCountries.map(country => (
        <li key={country.name.common}>
          {country.name.common}
          <button onClick={() => setSelectedCountry(country)}>show</button>
        </li>
      ))}
    </div>
  )
}

const App = () => {
  const apiUrl = 'https://studies.cs.helsinki.fi/restcountries/api/all'
  const [allCountries, setAllCountries] = useState([])
  const [searchStr, setSearchStr] = useState('')

  useEffect(() => {
    axios
      .get(apiUrl)
      .then(response => {
        const sortedCountries = response.data.sort((a, b) => (
          a.name.common.localeCompare(b.name.common)
        ))
        setAllCountries(sortedCountries)
      })
  }, [])

  const handleSearch = (event) => {
    setSearchStr(event.target.value)
  }

  return (
    <div>
      <h1>Maajuttuja</h1>
      <SearchForm searchStr={searchStr} handleSearch={handleSearch} />

      <DisplayCountries countries={allCountries} searchStr={searchStr} />
    </div>
  )
}

export default App
