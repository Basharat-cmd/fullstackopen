import { useState, useEffect } from 'react'
import axios from 'axios'

const CountryDetails = ({ country }) => {
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    const apiKey = import.meta.env.VITE_WEATHER_API_KEY
    if (!apiKey) return

    const capital = country.capital && country.capital[0]
    if (!capital) return

    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&units=metric&appid=${apiKey}`)
      .then(response => {
        setWeather(response.data)
      })
  }, [country])

  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>capital {country.capital && country.capital[0]}</p>
      <p>area {country.area}</p>

      <h3>languages:</h3>
      <ul>
        {Object.values(country.languages || {}).map(lang =>
          <li key={lang}>{lang}</li>
        )}
      </ul>

      {country.flags && <img src={country.flags.png} alt="flag" width="150" />}

      {weather && (
        <div>
          <h3>Weather in {country.capital[0]}</h3>
          <p>temperature {weather.main.temp} °C</p>
          {weather.weather[0] && (
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt="weather icon"
            />
          )}
          <p>wind {weather.wind.speed} m/s</p>
        </div>
      )}
    </div>
  )
}

const App = () => {
  const [allCountries, setAllCountries] = useState([])
  const [filter, setFilter] = useState('')
  const [showDetails, setShowDetails] = useState(null)

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setAllCountries(response.data)
      })
  }, [])

  const filtered = allCountries.filter(c =>
    c.name.common.toLowerCase().includes(filter.toLowerCase())
  )

  const handleShow = (country) => {
    setShowDetails(country)
  }

  return (
    <div>
      <div>
        find countries <input
          value={filter}
          onChange={(e) => { setFilter(e.target.value); setShowDetails(null) }}
        />
      </div>

      {filtered.length > 10 && (
        <p>Too many matches, specify another filter</p>
      )}

      {filtered.length <= 10 && filtered.length > 1 && (
        <ul>
          {filtered.map(country =>
            <li key={country.name.common}>
              {country.name.common}
              <button onClick={() => handleShow(country)}>show</button>
            </li>
          )}
        </ul>
      )}

      {filtered.length === 1 && (
        <CountryDetails country={filtered[0]} />
      )}

      {showDetails && filtered.length > 1 && (
        <CountryDetails country={showDetails} />
      )}
    </div>
  )
}

export default App
