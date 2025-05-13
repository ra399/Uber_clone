// MapComponent.jsx
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix default marker icon issue in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const MapComponent = () => {
  return (
    <MapContainer
     center={[18.566516, 83.211002]}
     zoom={8} style={{ height: '70%', width: '100%' }}
     dragging={true}
    >
      {/* Add OpenStreetMap tiles */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© Manideep Naidu"
      />
      
      {/* Add a marker */}
      <Marker position={[18.566516, 83.211002]}>
        <Popup>
          Sahithi Nagar, Bobbili, Vizianagaram
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapComponent;

