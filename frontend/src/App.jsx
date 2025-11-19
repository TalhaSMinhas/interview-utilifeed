import {useEffect, useState} from 'react'
import {checkHealth, fetchCities, fetchCity} from './api'
import './App.css'

//table component

{/*
The TableComp component receives the city data and displays it in a searchable,
scrollable, and responsive table.

1. I added a loading state to handle the case when the API hasn’t returned data yet.
   If the data is missing or empty, I show a friendly message instead of crashing.

2. I used a “favorites” system stored in localStorage. This lets users mark
   favourite cities and keeps the selection even after a page refresh.

3. For searching, I filter city names using toLowerCase() so the search is case-insensitive.

4. To improve usability, I sort the results so favourites appear at the top.
   This keeps important cities easy to find.

5. When the user clicks a city row, I fetch the detailed stats from the backend and
   show an alert with the min/mean/max and number of recordings.

6. The table is fully responsive. On small screens the extra columns (min/mean/max)
   automatically hide to keep the layout clean.

7. If the user searches for a city that doesn’t exist, or the filter removes all rows,
   I show a “No city data available” row instead of leaving a blank table.
*/
}

function TableComp({data}) {
    const [searchTerm, setSearchTerm] = useState('');
    const [favorites, setFavorites] = useState(() => {
        const saved = localStorage.getItem("favorites");
        return saved ? JSON.parse(saved) : [];
    });

    const loading = !data || !data.cities;

    if (loading) {
        return (
            <p style={{textAlign: "center", padding: "1rem"}}>
                Loading city data...
            </p>
        );
    }

    if (Object.keys(data.cities).length === 0) {
        return (
            <p style={{textAlign: "center", padding: "1rem"}}>
                No city data available.
            </p>
        );
    }

    function toggleFavorite(cityName) {
        const updated = favorites.includes(cityName)
            ? favorites.filter(f => f !== cityName)
            : [...favorites, cityName];

        setFavorites(updated);
        localStorage.setItem("favorites", JSON.stringify(updated));
    }

    const filteredData = Object.entries(data.cities).filter(([key]) => {
        if (searchTerm === "") return true;
        return key.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const sortedData = [
        ...filteredData.filter(([city]) => favorites.includes(city)),
        ...filteredData.filter(([city]) => !favorites.includes(city))
    ];

    async function handleRowClick(cityName) {
        try {
            const info = await fetchCity(cityName);

            const message =
                `
City: ${info.city}

Recorded: ${info.city_stats.count} times

❄ Minimum: ${info.city_stats.min}
🌡 Average: ${info.city_stats.mean}
🔥 Maximum: ${info.city_stats.max}
                `
            ;
            alert(message)
        } catch (error) {
            throw new Error(error)
        }
    }

    return (
        <div className="parent-table-container">
            <div className="search-bar-container">
                <span className="search-icon">🔍</span>
                <input
                    type="text"
                    placeholder="Search for cities..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="table_component" role="region" tabIndex="0">
                <table>
                    <caption><br/></caption>
                    <thead>
                    <tr>
                        <th>City</th>
                        <th className="col-min">Minimum Temperature</th>
                        <th className="col-mean">Average Temperature</th>
                        <th className="col-max">Maximum Temperature</th>
                        <th>Favourite</th>
                    </tr>
                    </thead>
                    <tbody>
                    {sortedData.length === 0 ? (
                        <tr>
                            <td colSpan="5" style={{textAlign: "center", padding: "1rem", color: "#555"}}>
                                No city data available.
                            </td>
                        </tr>
                    ) : (
                        sortedData.map(([city, stats]) => (
                            <tr key={city}>
                                <td onClick={() => handleRowClick(city)}>{city}</td>
                                <td className="col-min">{stats.min}</td>
                                <td className="col-mean">{stats.mean}</td>
                                <td className="col-max">{stats.max}</td>
                                <td style={{textAlign: "center"}}>
                                    <button
                                        onClick={() => toggleFavorite(city)}
                                        style={{
                                            background: "transparent",
                                            border: "none",
                                            fontSize: "1.2rem",
                                            cursor: "pointer"
                                        }}
                                    >
                                        {favorites.includes(city) ? "⭐" : "☆"}
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
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
            })
            .catch(error => console.log(error))
    }, [])

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

