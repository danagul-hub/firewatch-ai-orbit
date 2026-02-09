import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle } from 'react-leaflet';
import { Flame, TrendingUp, DollarSign, ShieldAlert, Trees } from 'lucide-react';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

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
            <span>Қауіп деңгейі: Жоғары</span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        <div className="w-80 p-4 border-r border-slate-700 bg-slate-800 overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4 border-b border-slate-600 pb-2">Белсенді мониторинг</h2>
          
          <div className="space-y-4">
            <div className="bg-slate-700 p-4 rounded-lg">
              <div className="text-slate-400 text-sm flex items-center gap-1">
                <Flame size={14} /> БЕЛСЕНДІ ӨРТТЕР
              </div>
              <div className="text-3xl font-bold">{fires.length}</div>
              <div className="text-xs text-orange-400 mt-1">AI Orbit спутнигі арқылы анықталды</div>
            </div>

            <div className="bg-slate-700 p-4 rounded-lg border-l-4 border-emerald-500">
              <div className="text-slate-400 text-sm flex items-center gap-1">
                <Trees size={14} /> АҒАШ ТҮРІ
              </div>
              <div className="text-lg font-bold text-emerald-400">
                {fires[0]?.tree_type || 'Анықталуда...'}
              </div>
              <div className="text-xs text-slate-300">Тығыздығы: {fires[0]?.tree_density || '...'}</div>
            </div>

            <div className="bg-slate-700 p-4 rounded-lg">
              <div className="text-slate-400 text-sm flex items-center gap-1">
                <TrendingUp size={14} /> БОЛЖАМ
              </div>
              <div className="text-lg font-semibold">{prediction?.direction || 'Есептелуде...'}</div>
              <div className="text-xs text-slate-300">Таралу уақыты: {prediction?.timeframe}</div>
            </div>

            <div className="bg-slate-700 p-4 rounded-lg border-l-4 border-green-500">
              <div className="text-slate-400 text-sm flex items-center gap-1">
                <DollarSign size={14} /> БОЛЖАМДЫ ШЫҒЫН
              </div>
              <div className="text-2xl font-bold text-green-400">
                ${damage ? (damage.estimated_damage_usd / 1000000).toFixed(1) + 'M' : '...'}
              </div>
              <div className="text-xs text-slate-300 italic">Экономикалық әсерді бағалау</div>
            </div>
          </div>

          <div className="mt-8 text-xs text-slate-500 bg-slate-900 p-3 rounded">
            <p className="font-bold mb-1">AI ТАЛДАУ:</p>
            "AI спектралды талдауы жанып жатқан аймақтың негізінен қылқан жапырақты ормандар екенін растады. Бұл өрттің таралу жылдамдығын арттырады."
          </div>
        </div>

        <div className="flex-1 relative">
          <MapContainer center={[48.0196, 66.9237]} zoom={5} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {fires.map(fire => (
              <React.Fragment key={fire.id}>
                <Marker position={[fire.lat, fire.lon]}>
                  <Popup>
                    <div className="text-slate-900">
                      <p className="font-bold">Өрт ID: #{fire.id}</p>
                      <p>Ағаш түрі: <span className="text-emerald-700">{fire.tree_type}</span></p>
                      <p>Қарқындылығы: {fire.intensity}</p>
                      <p className="text-red-600 font-semibold">AI арқылы анықталды</p>
                    </div>
                  </Popup>
                </Marker>
                <Circle center={[fire.lat, fire.lon]} radius={5000} pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 0.3 }} />
              </React.Fragment>
            ))}
            {prediction && (
              <Polyline 
                positions={prediction.spread_zone} 
                pathOptions={{ color: 'orange', weight: 5, dashArray: '10, 10' }} 
              />
            )}
          </MapContainer>
        </div>
      </main>
    </div>
  );
}

export default App;
