import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle, useMap } from 'react-leaflet';
import { Flame, TrendingUp, DollarSign, ShieldAlert, Trees, RefreshCw } from 'lucide-react';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Картаны өрт ошағына автоматты түрде бағыттау үшін компонент
function ChangeView({ center }) {
  const map = useMap();
  map.setView(center, map.getZoom());
  return null;
}

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
    const interval = setInterval(fetchData, 3000); // 3 секунд сайын жаңарту
    return () => clearInterval(interval);
  }, []);

  const currentFire = fires[0];

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-white font-sans">
      <header className="p-4 bg-slate-800 border-b border-slate-700 flex justify-between items-center shadow-lg z-20">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-orange-500 flex items-center gap-2">
            <Flame size={32} className="animate-bounce" /> FireWatch AI Orbit
          </h1>
          <div className="flex items-center gap-2 text-[10px] text-emerald-400 bg-emerald-950/30 px-3 py-1 rounded-full border border-emerald-500/20">
            <RefreshCw size={10} className="animate-spin" />
            LIVE SYNC: {lastSync}
          </div>
        </div>
        <div className="flex gap-4">
          <div className="bg-red-500/10 px-3 py-1 rounded-lg border border-red-500/50 flex items-center gap-2 text-red-400">
            <ShieldAlert size={18} />
            <span className="font-black text-sm uppercase">Қауіп: Жоғары</span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        <div className="w-80 p-4 border-r border-slate-700 bg-slate-800/95 overflow-y-auto shadow-2xl z-10 backdrop-blur-sm">
          <h2 className="text-lg font-bold mb-6 text-slate-300 uppercase tracking-widest border-b border-slate-700 pb-2">
            Спутниктік мониторинг
          </h2>
          
          <div className="space-y-5">
            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700 hover:border-orange-500/50 transition-colors">
              <div className="text-slate-500 text-[10px] font-bold uppercase mb-1 tracking-wider">Белсенді ошақтар</div>
              <div className="text-4xl font-black text-white">{fires.length}</div>
              <div className="text-[10px] text-orange-500/80 font-medium mt-1">AI анықтаған нақты деректер</div>
            </div>

            <div className="bg-emerald-950/20 p-4 rounded-xl border border-emerald-900/30">
              <div className="text-emerald-500/70 text-[10px] font-bold uppercase mb-1 tracking-wider flex items-center gap-1">
                <Trees size={12} /> Ағаш түрі
              </div>
              <div className="text-xl font-bold text-emerald-400">
                {currentFire ? currentFire.tree_type : 'Анықталуда...'}
              </div>
              <div className="text-[10px] text-emerald-600/80 mt-1">Тығыздығы: {currentFire ? currentFire.tree_density : '...'}</div>
            </div>

            <div className="bg-blue-950/20 p-4 rounded-xl border border-blue-900/30">
              <div className="text-blue-500/70 text-[10px] font-bold uppercase mb-1 tracking-wider flex items-center gap-1">
                <TrendingUp size={12} /> Таралу бағыты
              </div>
              <div className="text-xl font-bold text-blue-400">
                {prediction ? prediction.direction : 'Есептелуде...'}
              </div>
              <div className="text-[10px] text-blue-600/80 mt-1 italic">Болжамды уақыт: {prediction ? prediction.timeframe : '...'}</div>
            </div>

            <div className="bg-red-950/20 p-4 rounded-xl border border-red-900/30">
              <div className="text-red-500/70 text-[10px] font-bold uppercase mb-1 tracking-wider flex items-center gap-1">
                <DollarSign size={12} /> Экономикалық шығын
              </div>
              <div className="text-3xl font-black text-red-500">
                ${damage ? (damage.estimated_damage_usd / 1000000).toFixed(2) + 'M' : '...'}
              </div>
              <div className="text-[10px] text-red-700 mt-1 uppercase font-bold tracking-tighter animate-pulse">Критикалық әсер</div>
            </div>
          </div>

          <div className="mt-10 p-4 bg-orange-500/5 rounded-xl border border-orange-500/20">
            <h4 className="text-[10px] font-bold text-orange-500 uppercase mb-2">AI Интеллект:</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed italic">
              "Спектралды талдау жалынның Бурабай ұлттық паркінің солтүстік бөлігіндегі қылқан жапырақты массивке өткенін көрсетеді. Шұғыл әрекет ету ұсынылады."
            </p>
          </div>
        </div>

        <div className="flex-1 relative">
          <MapContainer center={[53.0833, 70.3000]} zoom={13} style={{ height: '100%', width: '100%' }}>
            {currentFire && <ChangeView center={[currentFire.lat, currentFire.lon]} />}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {fires.map(fire => (
              <React.Fragment key={fire.id}>
                <Marker position={[fire.lat, fire.lon]}>
                  <Popup>
                    <div className="text-slate-900 p-2 min-w-[150px]">
                      <p className="font-black text-sm border-b pb-1 mb-2">ОШАҚ #{fire.id}</p>
                      <div className="space-y-1 text-[11px]">
                        <p><b>Ағаш:</b> {fire.tree_type}</p>
                        <p><b>Қарқындылық:</b> <span className="text-red-600 font-bold">{fire.intensity}</span></p>
                        <p><b>Уақыты:</b> {fire.last_update}</p>
                      </div>
                      <div className="mt-2 text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                         БЕЛСЕНДІ БАҚЫЛАУ
                      </div>
                    </div>
                  </Popup>
                </Marker>
                <Circle 
                  center={[fire.lat, fire.lon]} 
                  radius={1000} 
                  pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 0.25, weight: 1 }} 
                />
              </React.Fragment>
            ))}
            {prediction && (
              <Polyline 
                positions={prediction.spread_zone} 
                pathOptions={{ color: 'orange', weight: 4, dashArray: '10, 10', opacity: 0.8 }} 
              />
            )}
          </MapContainer>
          
          <div className="absolute top-6 right-6 bg-slate-800/90 p-4 rounded-2xl shadow-2xl z-[1000] border border-slate-700 backdrop-blur-md">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">Карта аңызы</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-red-600 rounded-full shadow-[0_0_12px_rgba(220,38,38,0.8)] animate-pulse"></div> 
                <span className="text-xs font-medium text-slate-300 tracking-tight">Өрт ошағы (Active)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-0.5 border-t-2 border-dashed border-orange-500"></div> 
                <span className="text-xs font-medium text-slate-300 tracking-tight">Болжамды таралу</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
