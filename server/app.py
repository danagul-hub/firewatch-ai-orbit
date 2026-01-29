from flask import Flask, jsonify
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)

# MVP Data for California
CALIFORNIA_FIRE = {
    "id": 1,
    "lat": 37.7749,
    "lon": -122.4194,
    "intensity": "High",
    "status": "Active",
    "detected_by": "AI Orbit Satellite-V1"
}

@app.route('/fires')
def get_fires():
    return jsonify([CALIFORNIA_FIRE])

@app.route('/prediction')
def get_prediction():
    # Simple logic for MVP: spread North-East
    return jsonify({
        "fire_id": 1,
        "direction": "North-East",
        "spread_zone": [
            [37.7749, -122.4194],
            [37.8000, -122.3800],
            [37.8500, -122.3500]
        ],
        "timeframe": "6-12h",
        "risk_level": "High"
    })

@app.route('/damage')
def get_damage():
    # Formula: area * factor (simulated)
    area_sq_km = random.uniform(50, 150)
    damage_usd = area_sq_km * 25000 # $25k per sq km
    return jsonify({
        "estimated_damage_usd": round(damage_usd, 2),
        "area_affected_km2": round(area_sq_km, 2),
        "currency": "USD"
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
