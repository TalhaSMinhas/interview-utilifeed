from re import split

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

def get_weather_map():
    weather_map = {}

    file = open("../measurements.txt")

    for line in file:
        cleaned_line = line.strip()
        if len(cleaned_line) == 0:
            continue

        split_line = cleaned_line.split(';')

        temperature = float(split_line[1])

        if split_line[0] not in weather_map:
            weather_map[split_line[0]] = list()

        weather_map[split_line[0]].append(temperature)

    return weather_map

'''
the get weather map function opens the text file and reads its lines.
it removes whitespace from the line, and checkes if the cleaned_line is empty.
if the cleaned_line is empty, it skips it, otherwise it

splits the line from the semi-colon, 
after splitting the line we have an array like [city, string temperature]
we set out temperature variable to index 1 of the splt line array and cast it to a float

then we chech if the city i.e. index 0 of the splt line array in our weather map
and give its value an empty list

thereafter we add the temperaure to that list
'''

def get_stats(weather_map):
    stats_map = {}

    for city, temperature in weather_map.items():
        stats_map[city] = {
            'city': city,
            'min': min(temperature),
            'max': max(temperature),
            'mean': round(sum(temperature) / len(temperature), 1),
            'count': len(temperature)
        }

    return stats_map

def to_fahrenheit(value):
    return round(((value * 1.8) + 32), 1)

def get_stats_fahrenheit(weather_map):
    stats_map = {}

    for city, temperature in weather_map.items():
        stats_map[city] = {
            'city': city,
            'min': to_fahrenheit(min(temperature)),
            'max': to_fahrenheit(max(temperature)),
            'mean': to_fahrenheit(sum(temperature) / len(temperature)),
            'count': len(temperature)
        }

    return stats_map

@app.route('/api/cities', methods=['GET'])
def get_cities():
    weather_map = get_weather_map()
    stats = get_stats(weather_map)
    return jsonify({
        'cities': stats,
        'total_cities': len(stats)
    })

@app.route('/api/cities/<city_name>', methods=['GET'])
def get_city(city_name):
    weather_map = get_weather_map()
    stats = get_stats(weather_map)

    if city_name not in stats:
        return jsonify({"error": "City not found"}), 404


    return jsonify({
        'city': city_name,
        'city_stats': stats[city_name],
    })

@app.route('/api/cities/fahrenheit', methods=['GET'])
def get_cities_fahrenheit():
    weather_map = get_weather_map()
    stats = get_stats_fahrenheit(weather_map)
    return jsonify({
        'cities': stats,
        'total_fahrenheit': len(stats),
    })

@app.route('/api/cities/fahrenheit/<city_name>', methods=['GET'])
def get_city_fahrenheit(city_name):
    weather_map = get_weather_map()
    stats = get_stats_fahrenheit(weather_map)

    if city_name not in stats:
        return jsonify({"error": "City not found"}), 404

    return jsonify({
        'city': city_name,
        'city_stats': stats[city_name],
    })

@app.route('/api/health', methods=['GET'])
def health_check():
    """Simple health check endpoint."""
    return jsonify({"status": "healthy", "service": "weather-api"})

if __name__ == '__main__':
    app.run(debug=True, port=5000)

