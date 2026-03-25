import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const STATUS_COLOR = { 
  Red: '#ef4444', 
  Yellow: '#f59e0b', 
  Green: '#10b981',
  Mitra: '#3b82f6' 
};

export default function EcosystemMap({ farmers = [], mitras = [], selectedId, onSelect, height = "540px" }) {
  return (
    <MapContainer 
      center={[13.0, 76.1]} 
      zoom={10} 
      style={{ height, borderRadius: '2rem', background: '#020617' }} 
      className="[&_.leaflet-control-zoom]:hidden"
    >
      <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
      
      {/* Farmers Layer */}
      {farmers.map((f, i) => (
        <CircleMarker 
          key={f.id || `f-${i}`} 
          center={[f.lat || 13, f.lng || 76]} 
          radius={f.score >= 65 ? 14 : 9} 
          pathOptions={{ 
            fillColor: f.score >= 65 ? STATUS_COLOR.Red : (f.score >= 35 ? STATUS_COLOR.Yellow : STATUS_COLOR.Green), 
            color: '#fff', 
            weight: selectedId === f.id ? 4 : 1, 
            fillOpacity: 0.8 
          }}
          eventHandlers={{ click: () => onSelect && onSelect(f) }}
        >
          <Tooltip className="!bg-[#020617] !border-white/10 !text-white !p-4 !rounded-2xl !shadow-2xl">
            <div className="font-black text-sm">{f.name}</div>
            <div className="text-[9px] font-bold text-slate-500 uppercase">Farmer · {f.taluk} · {f.score} Index</div>
          </Tooltip>
        </CircleMarker>
      ))}

      {/* Mitras Layer */}
      {mitras.map((m, i) => (
        <CircleMarker 
          key={m.id || `m-${i}`} 
          center={[m.lat || 13.05, m.lng || 76.15]} 
          radius={11} 
          pathOptions={{ 
            fillColor: STATUS_COLOR.Mitra, 
            color: '#fff', 
            weight: selectedId === m.id ? 4 : 1, 
            fillOpacity: 1 
          }}
          eventHandlers={{ click: () => onSelect && onSelect(m) }}
        >
          <Tooltip className="!bg-[#1e3a8a] !border-blue-500/30 !text-white !p-4 !rounded-2xl !shadow-2xl">
            <div className="font-black text-sm">{m.name}</div>
            <div className="text-[9px] font-bold text-blue-200 uppercase">Mitra Unit · {m.taluk} Sector</div>
            <div className="text-[8px] font-bold text-blue-400 uppercase mt-1">Status: {m.status || 'Active'}</div>
          </Tooltip>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}
