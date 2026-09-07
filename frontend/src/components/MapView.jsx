import { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const FitBounds = ({ points }) => {
  const map = useMap();
  useEffect(() => {
    if (points.length > 0) {
      const bounds = L.latLngBounds(points.map((p) => [p.lat, p.lng]));
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 12 });
    }
  }, [map, points]);
  return null;
};

export default function MapView({ points = [], height = 400, onPointClick, showLegend = false, onMapClick }) {
  const center = points.length > 0 ? [points[0].lat, points[0].lng] : [22.5, 78.9];

  const ClickHandler = () => {
    const map = useMap();
    useEffect(() => {
      if (!onMapClick) return;
      const handler = (e) => onMapClick(e.latlng);
      map.on('click', handler);
      return () => map.off('click', handler);
    }, [map]);
    return null;
  };

  return (
    <div className="relative rounded-lg overflow-hidden border border-zinc-800" style={{ height }} data-testid="map-view">
      <MapContainer center={center} zoom={5} style={{ height: '100%', width: '100%' }} zoomControl>
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds points={points} />
        <ClickHandler />
        {points.map((p) => {
          const color = p.color || (p.status === 'active' ? '#10b981' : p.status === 'pending' ? '#f59e0b' : p.status === 'new' ? '#ef4444' : '#ef4444');
          return (
            <CircleMarker
              key={p.id}
              center={[p.lat, p.lng]}
              radius={p.radius || 8}
              pathOptions={{ color, fillColor: color, fillOpacity: 0.6, weight: 2 }}
              eventHandlers={{
                click: () => onPointClick && onPointClick(p),
              }}
            >
              <Popup>
                <div className="text-xs">
                  <div className="font-semibold">{p.label || p.id}</div>
                  {p.note && <div className="text-zinc-500 mt-1">{p.note}</div>}
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
      {showLegend && (
        <div className="absolute bottom-3 right-3 bg-zinc-950/90 border border-zinc-800 rounded p-3 space-y-1.5 z-[400]">
          <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-1">Status</div>
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-zinc-300">Active</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span className="text-zinc-300">Pending</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 pulse-dot"></span>
            <span className="text-zinc-300">Alert</span>
          </div>
        </div>
      )}
    </div>
  );
}
