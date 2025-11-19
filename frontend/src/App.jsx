import { useState, useEffect } from 'react'
import {checkHealth, fetchCities} from './api'
import './App.css'

//table component
function TableComp({ data }){
    if (!data || !data.cities) {
        return <p>Loading cities...</p>;
    }

    return(
        <div className="parent-table-container">
            <div className="search-bar-container">
                <span>🔍</span>
                <input type="text" placeholder="Search for cities..."/>
            </div>
            <div className="table_component" role="region" tabIndex="0">
                <table>
                    <caption><br/></caption>
                    <thead>
                    <tr>
                        <th>City</th>
                        <th>Minimum Temperature</th>
                        <th>Average Temperature</th>
                        <th>Maximum Temperature</th>
                        <th>Favourite</th>
                    </tr>
                    </thead>
                    <tbody>
                    {Object.entries(data.cities).map(([city, stats]) => (
                        <tr key={city}>
                            <td>{city}</td>
                            <td>{stats.min}</td>
                            <td>{stats.mean}</td>
                            <td>{stats.max}</td>
                            <td style={{ textAlign: "center" }}>
                                <button
                                    style={{
                                        background: "transparent",
                                        border: "none",
                                        fontSize: "1.2rem",
                                        cursor: "pointer"
                                    }}
                                >
                                    Fav
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

function App() {
    const [apiHealth, setApiHealth] = useState(null)
    const [cities, setCities] = useState([]);

    useEffect(() => {
        checkApiHealth()
    }, [])

    const checkApiHealth = async () => {
        try {
            const health = await checkHealth()
            setApiHealth(health)
        } catch (err) {
            setApiHealth({status: 'unhealthy', error: err.message})
        }
    }

    // TODO: Implement the UI to display the city data
    //
    // Your task:
    // 1. Create a layout to display the cities data
    // 2. Show each city's min, max, and mean temperatures
    // 3. Add a search input to filter cities (use the searchQuery state)
    // 4. Display loading state while data is being fetched
    // 5. Display error messages if the API fails
    // 6. Handle the case when no cities are found
    //
    // The data structure in `cities` is:
    // {
    //   "CityName": { min: number, max: number, mean: number, count: number },
    //   ...
    // }
    //
    // Hints:
    // - Use Object.entries(cities) to iterate over the cities
    // - Call loadCities(query) to fetch filtered results
  // - The loading, error, and totalCities states are already managed

    useEffect(() => {
        fetchCities()
            .then(res => {
                setCities(res)
                console.log(res)
            })
            .catch(error => console.log(error))
    },[])

  return (
    <div className="app">
      <header className="app-header">
        <h1>🌡️ Weather Statistics Dashboard</h1>
        <p>Temperature data for cities around the world</p>
      </header>

      <div className="container">
        {/* Example: Health Check - This demonstrates a working API call */}
        <div className="health-check">
          <h3>API Status</h3>
          {apiHealth ? (
            <div className={`health-status ${apiHealth.status === 'healthy' ? 'healthy' : 'unhealthy'}`}>
              <span className="status-dot"></span>
              {apiHealth.status === 'healthy' ? (
                <>
                  <strong>✓ Connected</strong> - Backend API is running
                </>
              ) : (
                <>
                  <strong>✗ Disconnected</strong> - Backend API is not responding
                </>
              )}
            </div>
          ) : (
            <div className="health-status checking">Checking...</div>
          )}
          <p className="health-note">
            💡 This is a working example using the <code>/api/health</code> endpoint.
            Check <code>src/api.js</code> to see how it's implemented.
          </p>
        </div>

        <div className="message">
          <TableComp data={cities}/>
        </div>
      </div>
    </div>
  )
}

export default App

