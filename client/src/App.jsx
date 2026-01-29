import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle } from 'react-leaflet';
import { Flame, TrendingUp, DollarSign, ShieldAlert } from 'lucide-react';
import L from 'leaflet';

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const API_URL = ''; // Use proxy

function App() {
  const [fires, setFires] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [damage, setDamage] = useState(null);

  useEffect(() => {
    fetch('/api/fires').then(res => res.json()).then(setFires);
    fetch('/api/prediction').then(res => res.json()).then(setPrediction);
    fetch('/api/damage').then(res => res.json()).then(setDamage);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-white font-sans">
      <header className="p-4 bg-slate-800 border-b border-slate-700 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-orange-500 flex items-center gap-2">
          <Flame size={32} /> FireWatch AI Orbit
        </h1>
        <div className="flex gap-4">
          <div className="bg-slate-700 p-2 rounded flex items-center gap-2">
            <ShieldAlert className="text-red-400" />
            <span>Risk: High</span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Sidebar Dashboard */}
        <div className="w-80 p-4 border-r border-slate-700 bg-slate-800 overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4 border-b border-slate-600 pb-2">Active Monitor</h2>
          
          <div className="space-y-4">
            <div className="bg-slate-700 p-4 rounded-lg">
              <div className="text-slate-400 text-sm flex items-center gap-1">
                <Flame size={14} /> ACTIVE FIRES
              </div>
              <div className="text-3xl font-bold">{fires.length}</div>
              <div className="text-xs text-orange-400 mt-1">Detected by AI Orbit Satellite</div>
            </div>

            <div className="bg-slate-700 p-4 rounded-lg">
              <div className="text-slate-400 text-sm flex items-center gap-1">
                <TrendingUp size={14} /> PREDICTION
              </div>
              <div className="text-lg font-semibold">{prediction?.direction || 'Calculating...'}</div>
              <div className="text-xs text-slate-300">Spread timeframe: {prediction?.timeframe}</div>
            </div>

            <div className="bg-slate-700 p-4 rounded-lg border-l-4 border-green-500">
              <div className="text-slate-400 text-sm flex items-center gap-1">
                <DollarSign size={14} /> ESTIMATED DAMAGE
              </div>
              <div className="text-2xl font-bold text-green-400">
                ${damage ? (damage.estimated_damage_usd / 1000000).toFixed(1) + 'M' : '...'}
              </div>
              <div className="text-xs text-slate-300 italic">Economic impact assessment</div>
            </div>
          </div>

          <div className="mt-8 text-xs text-slate-500 bg-slate-900 p-3 rounded">
            <p className="font-bold mb-1">AI INSIGHTS:</p>
            "Satellite data indicates high fuel load in Northern California. Wind speeds favorable for rapid spread."
          </div>
        </div>

        {/* Map Container */}
        <div className="flex-1 relative">
          <MapContainer center={[37.7749, -122.4194]} zoom={10} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {fires.map(fire => (
              <React.Fragment key={fire.id}>
                <Marker position={[fire.lat, fire.lon]}>
                  <Popup>
                    <div className="text-slate-900">
                      <p className="font-bold">Fire ID: #{fire.id}</p>
                      <p>Intensity: {fire.intensity}</p>
                      <p className="text-red-600 font-semibold">Detected by AI</p>
                    </div>
                  </Popup>
                </Marker>
                <Circle center={[fire.lat, fire.lon]} radius={2000} pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 0.3 }} />
              </React.Fragment>
            ))}
            {prediction && (
              <Polyline 
                positions={prediction.spread_zone} 
                pathOptions={{ color: 'orange', weight: 5, dashArray: '10, 10' }} 
              />
            )}
          </MapContainer>
          
          <div className="absolute bottom-4 right-4 bg-slate-800 p-2 rounded shadow-lg z-[1000] border border-slate-600 text-xs">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div> <span>Detected Fire</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-1 border-t-2 border-dashed border-orange-500"></div> <span>Predicted Spread (12h)</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
