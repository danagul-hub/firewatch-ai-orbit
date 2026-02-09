from flask import Flask, jsonify
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)

# MVP Data for Kazakhstan
# Добавляем тип леса (tree_type)
KAZAKHSTAN_FIRE = {
    "id": 1,
    "lat": 53.0833,
    "lon": 70.3000,
    "intensity": "Жоғары",
    "status": "Белсенді",
    "detected_by": "AI Orbit Satellite-V1",
    "tree_type": "Қарағай (Pine)", # Тип дерева
    "tree_density": "Жоғары"
}

@app.route('/fires')
def get_fires():
    return jsonify([KAZAKHSTAN_FIRE])

@app.route('/prediction')
def get_prediction():
    return jsonify({
        "fire_id": 1,
        "direction": "Солтүстік-Шығыс",
        "spread_zone": [
            [53.0833, 70.3000],
            [53.1500, 70.4500],
            [53.2500, 70.6000]
        ],
        "timeframe": "6-12 сағат",
        "risk_level": "Жоғары"
    })

@app.route('/damage')
def get_damage():
    area_sq_km = random.uniform(20, 80)
    damage_usd = area_sq_km * 15000
    return jsonify({
        "estimated_damage_usd": round(damage_usd, 2),
        "area_affected_km2": round(area_sq_km, 2),
        "currency": "USD"
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
