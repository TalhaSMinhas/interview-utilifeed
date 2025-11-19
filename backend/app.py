from flask import Flask, jsonify, request
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(
    app,
    resources={r"/*": {"origins": "*"}},
    supports_credentials=True
)

# TODO: Implement the following endpoints
# You will need to:
# 1. Read and parse the measurements file (measurements.txt)
# 2. Process the data to calculate min, max, and mean temperatures per city
# 3. Handle invalid data rows appropriately
# 4. Return the data in the specified JSON format
# 
# @app.route('/api/cities', methods=['GET'])
# def get_cities():
#     """
#     Get temperature statistics for all cities.
#     
#     Query parameters:
#         search (str): Optional search query to filter cities by name
#     
#     Returns:
#         JSON response with city statistics in the format:
#         {
#             "cities": {
#                 "CityName": {"min": float, "max": float, "mean": float, "count": int},
#                 ...
#             },
#             "total_cities": int
#         }
#     
#     Hints:
#     - The data file is at: '../measurements.txt' (relative to this file)
#     - Each line format: "CityName;Temperature"
#     - You need to calculate min, max, mean (rounded to 1 decimal) for each city
#     - Handle invalid/malformed rows gracefully
#     - Support optional ?search=query parameter to filter cities
#     """
#     pass
#
# @app.route('/api/cities/<city_name>', methods=['GET'])
# def get_city(city_name):
#     """
#     Get temperature statistics for a specific city.
#     
#     Args:
#         city_name (str): Name of the city
#     
#     Returns:
#         JSON response with city statistics
#         Return 404 if city not found
#     
#     Example response:
#     {
#         "city": "Hamburg",
#         "statistics": {"min": -10.5, "max": 35.2, "mean": 12.4, "count": 842}
#     }
#     """
#     pass

@app.route('/api/health', methods=['GET'])
def health_check():
    """Simple health check endpoint."""
    return jsonify({"status": "healthy", "service": "weather-api"})

if __name__ == '__main__':
    app.run(debug=True, port=5000)

