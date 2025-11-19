const API_BASE_URL = 'http://127.0.0.1:5000';

/**
 * TODO: Implement this function to fetch all cities with their temperature statistics
 * 
 * This should call GET /api/cities (with optional ?search=query parameter)
 * 
 * @param {string} searchQuery - Optional search query to filter cities
 * @returns {Promise<Object>} Response with cities data in the format:
 * {
 *   cities: { "CityName": { min, max, mean, count }, ... },
 *   total_cities: number
 * }
 * 
 * Hint: Use the fetch API to make the HTTP request
 * Hint: Don't forget to handle errors appropriately
 */
export async function fetchCities() {
    try{
        const response = await fetch(`${API_BASE_URL}/api/cities`)

        if (response.ok){
            return await response.json()
        }
        else{
            throw new Error('Failed to fetch cities.')
        }
    }catch(error) {
        throw new Error(`Failed to fetch cities, ${error}`)
    }
}

/**
 * TODO: Implement this function to fetch statistics for a specific city
 * 
 * This should call GET /api/cities/{cityName}
 * 
 * @param {string} cityName - Name of the city
 * @returns {Promise<Object>} Response with city statistics in the format:
 * {
 *   city: "CityName",
 *   statistics: { min, max, mean, count }
 * }
 * 
 * Hint: Use encodeURIComponent for the city name in the URL
 * Hint: Handle 404 errors for cities that don't exist
 */
export async function fetchCity(cityName) {
  // TODO: Implement this function
  throw new Error('fetchCity not yet implemented - this is part of your task!');
}

/**
 * Check API health
 * @returns {Promise<Object>} Health check response
 */
export async function checkHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error checking health:', error);
    throw error;
  }
}

