import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Marker } from 'react-leaflet';
import L from 'leaflet';
import type { Community, CommunityResource } from '../../types/community';
import { getRiskColor } from '../../utils/risk';
import { MapLegend } from './MapLegend';

export interface CommunityMapProps {
  communities: Community[];
  resources: CommunityResource[];
  selectedCommunity: Community | null;
  onSelectCommunity: (community: Community) => void;
  showResources: boolean;
}

// Leaflet default marker fix
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export const CommunityMap: React.FC<CommunityMapProps> = ({
  communities,
  resources,
  selectedCommunity,
  onSelectCommunity,
  showResources,
}) => {
  // Default US center
  const center: [number, number] = selectedCommunity
    ? [selectedCommunity.latitude, selectedCommunity.longitude]
    : [39.8283, -98.5795];

  const zoom = selectedCommunity ? 10 : 4;

  return (
    <div className="relative w-full h-full min-h-[450px] rounded-xl border border-slate-200 overflow-hidden shadow-xs">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        className="w-full h-full min-h-[450px]"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Community Circle Markers */}
        {communities.map(c => {
          const color = getRiskColor(c.riskLevel);
          const isSelected = selectedCommunity?.communityId === c.communityId;

          return (
            <CircleMarker
              key={c.communityId}
              center={[c.latitude, c.longitude]}
              radius={isSelected ? 16 : 10}
              pathOptions={{
                fillColor: color,
                fillOpacity: 0.8,
                color: isSelected ? '#000000' : '#ffffff',
                weight: isSelected ? 3 : 1.5,
              }}
              eventHandlers={{
                click: () => onSelectCommunity(c),
              }}
            >
              <Popup>
                <div className="p-1 text-xs">
                  <h4 className="font-bold text-slate-900 text-sm mb-1">{c.name}</h4>
                  <p className="text-slate-600">SDOH Score: <strong className="text-slate-900">{c.sdohScore}</strong></p>
                  <p className="text-slate-600">High Risk Members: <strong className="text-red-600">{c.highRiskMembers}</strong></p>
                  <button
                    onClick={() => onSelectCommunity(c)}
                    className="mt-2 text-blue-600 font-semibold hover:underline block"
                  >
                    Select Community
                  </button>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}

        {/* Resource Markers */}
        {showResources &&
          resources.map(r => (
            <Marker key={r.id} position={[r.latitude, r.longitude]} icon={defaultIcon}>
              <Popup>
                <div className="p-1 text-xs">
                  <span className="font-bold text-slate-900">{r.name}</span>
                  <span className="block text-slate-500 capitalize">{r.type.replace('_', ' ')}</span>
                  <span className="block text-[10px] text-slate-400 mt-1">{r.note}</span>
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>

      {/* Floating Legend */}
      <div className="absolute bottom-4 left-4 z-40">
        <MapLegend />
      </div>
    </div>
  );
};
