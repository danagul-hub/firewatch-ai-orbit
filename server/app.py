from flask import Flask, jsonify
from flask_cors import CORS
import random
import time

app = Flask(__name__)
CORS(app)

# Изначальные координаты (центр Казахстана)
fire_lat = 53.0833
fire_lon = 70.3000

@app.route('/fires')
def get_fires():
    global fire_lat, fire_lon
    # Симуляция реального движения (небольшое смещение)
    fire_lat += random.uniform(-0.001, 0.001)
    fire_lon += random.uniform(-0.001, 0.001)
    
    return jsonify([{
        "id": 1,
        "lat": fire_lat,
        "lon": fire_lon,
        "intensity": random.choice(["Орташа", "Жоғары", "Өте жоғары"]),
        "status": "Белсенді",
        "detected_by": "AI Orbit Satellite-V1",
        "tree_type": "Қарағай (Pine)",
        "tree_density": "Жоғары",
        "last_update": time.strftime("%H:%M:%S")
    }])

@app.route('/prediction')
def get_prediction():
    return jsonify({
        "fire_id": 1,
        "direction": "Солтүстік-Шығыс",
        "spread_zone": [
            [fire_lat, fire_lon],
            [fire_lat + 0.05, fire_lon + 0.1],
            [fire_lat + 0.1, fire_lon + 0.15]
        ],
        "timeframe": "6-12 сағат",
        "risk_level": "Жоғары"
    })

@app.route('/damage')
def get_damage():
    # Шығынды динамикалық түрде өзгерту
    area_sq_km = random.uniform(45.5, 48.2)
    damage_usd = area_sq_km * 15000
    return jsonify({
        "estimated_damage_usd": round(damage_usd, 2),
        "area_affected_km2": round(area_sq_km, 2),
        "currency": "USD"
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
