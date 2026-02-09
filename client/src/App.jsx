import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle } from 'react-leaflet';
import { Flame, TrendingUp, DollarSign, ShieldAlert, Trees, RefreshCw } from 'lucide-react';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function App() {
  const [fires, setFires] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [damage, setDamage] = useState(null);
  const [lastSync, setLastSync] = useState(new Date().toLocaleTimeString());

  const fetchData = async () => {
    try {
      const firesRes = await fetch('/api/fires');
      const firesData = await firesRes.json();
      setFires(firesData);

      const predRes = await fetch('/api/prediction');
      const predData = await predRes.json();
      setPrediction(predData);

      const damageRes = await fetch('/api/damage');
      const damageData = await damageRes.json();
      setDamage(damageData);
      
      setLastSync(new Date().toLocaleTimeString());
    } catch (err) {
      console.error("Data fetch error:", err);
    }
  };

  useEffect(() => {
    fetchData();
    // Интервал обновления каждые 5 секунд для "настоящего" реального времени
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-white font-sans">
      <header className="p-4 bg-slate-800 border-b border-slate-700 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-orange-500 flex items-center gap-2">
            <Flame size={32} /> FireWatch AI Orbit
          </h1>
          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900 px-3 py-1 rounded-full animate-pulse">
            <RefreshCw size={12} className="animate-spin" />
            Тікелей эфир: {lastSync}
          </div>
        </div>
        <div className="flex gap-4">
          <div className="bg-slate-700 p-2 rounded flex items-center gap-2 border border-red-500/30">
            <ShieldAlert className="text-red-400" />
            <span className="font-bold">Қауіп деңгейі: Жоғары</span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        <div className="w-80 p-4 border-r border-slate-700 bg-slate-800 overflow-y-auto shadow-2xl z-10">
          <h2 className="text-xl font-semibold mb-4 border-b border-slate-600 pb-2 flex items-center gap-2">
             Нақты уақыттағы деректер
          </h2>
          
          <div className="space-y-4">
            <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600">
              <div className="text-slate-400 text-sm flex items-center gap-1">
                <Flame size={14} /> БЕЛСЕНДІ ӨРТТЕР
              </div>
              <div className="text-3xl font-bold text-orange-400">{fires.length}</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-1">Спутниктен жаңартылды</div>
            </div>

            <div className="bg-slate-700/50 p-4 rounded-lg border-l-4 border-emerald-500 border-y border-r border-slate-600">
              <div className="text-slate-400 text-sm flex items-center gap-1">
                <Trees size={14} /> АҒАШ ТҮРІ
              </div>
              <div className="text-lg font-bold text-emerald-400">
                {fires[0]?.tree_type || 'Анықталуда...'}
              </div>
              <div className="text-xs text-slate-300">Орман тығыздығы: {fires[0]?.tree_density || '...'}</div>
            </div>

            <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600">
              <div className="text-slate-400 text-sm flex items-center gap-1">
                <TrendingUp size={14} /> ТАРАЛУ БАҒЫТЫ
              </div>
              <div className="text-lg font-semibold text-blue-400">{prediction?.direction || 'Есептелуде...'}</div>
              <div className="text-xs text-slate-300">Қамту уақыты: {prediction?.timeframe}</div>
            </div>

            <div className="bg-slate-700/50 p-4 rounded-lg border-l-4 border-red-500 border-y border-r border-slate-600">
              <div className="text-slate-400 text-sm flex items-center gap-1 text-red-300">
                <DollarSign size={14} /> БОЛЖАМДЫ ШЫҒЫН
              </div>
              <div className="text-2xl font-bold text-red-400">
                ${damage ? (damage.estimated_damage_usd / 1000000).toFixed(2) + 'M' : '...'}
              </div>
              <div className="text-xs text-slate-400 italic">Нақты уақыттағы экономикалық шығын</div>
            </div>
          </div>

          <div className="mt-8 text-[11px] text-slate-400 bg-slate-900/50 p-3 rounded border border-slate-700">
            <p className="font-bold text-orange-500 mb-1 uppercase tracking-tighter">AI Orbit Инсайт:</p>
            "Деректердің соңғы жаңаруы бойынша жалынның солтүстік-шығысқа қарай 3.2 м/с жылдамдықпен жылжып бара жатқаны байқалады. Жақын маңдағы елді мекендерге ескерту жіберілді."
          </div>
        </div>

        <div className="flex-1 relative">
          <MapContainer center={[53.0833, 70.3000]} zoom={12} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {fires.map(fire => (
              <React.Fragment key={fire.id}>
                <Marker position={[fire.lat, fire.lon]}>
                  <Popup>
                    <div className="text-slate-900 p-1">
                      <p className="font-bold border-b mb-1">Өрт ID: #{fire.id}</p>
                      <p className="text-xs"><b>Түрі:</b> {fire.tree_type}</p>
                      <p className="text-xs"><b>Қарқындылығы:</b> {fire.intensity}</p>
                      <p className="text-xs text-red-600 mt-1 font-bold">● Тікелей бақылау</p>
                    </div>
                  </Popup>
                </Marker>
                <Circle center={[fire.lat, fire.lon]} radius={2000} pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 0.2 }} />
              </React.Fragment>
            ))}
            {prediction && (
              <Polyline 
                positions={prediction.spread_zone} 
                pathOptions={{ color: 'orange', weight: 4, dashArray: '8, 8', opacity: 0.6 }} 
              />
            )}
          </MapContainer>
          
          <div className="absolute top-4 right-4 bg-slate-800/90 p-3 rounded shadow-xl z-[1000] border border-slate-600 backdrop-blur-sm">
            <h4 className="text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-widest">Аңыз</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div> 
                <span className="text-[11px]">Белсенді өрт ошағы</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-0.5 border-t border-dashed border-orange-500"></div> 
                <span className="text-[11px]">Болжамды бағыт</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
