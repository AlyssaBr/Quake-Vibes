'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { ProcessedEarthquake } from '../types/earthquake';

// Dynamically import map components to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const CircleMarker = dynamic(() => import('react-leaflet').then(mod => mod.CircleMarker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false });

interface EarthquakeMapProps {
  earthquakes: ProcessedEarthquake[];
}

function getMagnitudeColor(magnitude: number): string {
  if (magnitude >= 6) return '#e74c3c'; // Red for high magnitude
  if (magnitude >= 4) return '#f39c12'; // Orange for medium magnitude
  return '#27ae60'; // Green for low magnitude
}

function getMagnitudeRadius(magnitude: number): number {
  // Scale radius based on magnitude (minimum 3, maximum 25)
  return Math.max(3, Math.min(25, magnitude * 4));
}

function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  }).format(date);
}

export default function EarthquakeMap({ earthquakes }: EarthquakeMapProps) {
  const mapRef = useRef<any>(null);

  useEffect(() => {
    // Import leaflet CSS on client side
    import('leaflet/dist/leaflet.css');
  }, []);

  if (typeof window === 'undefined') {
    return (
      <div className="map-container">
        <div className="loading">Loading map...</div>
      </div>
    );
  }

  return (
    <div className="map-container">
      <MapContainer
        ref={mapRef}
        center={[20, 0]}
        zoom={2}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {earthquakes.map((earthquake) => (
          <CircleMarker
            key={earthquake.id}
            center={[earthquake.latitude, earthquake.longitude]}
            radius={getMagnitudeRadius(earthquake.magnitude)}
            pathOptions={{
              fillColor: getMagnitudeColor(earthquake.magnitude),
              color: 'white',
              weight: 1,
              opacity: 0.8,
              fillOpacity: 0.7
            }}
          >
            <Popup>
              <div>
                <div className="popup-title">{earthquake.place}</div>
                <div className="popup-details">
                  <strong>Magnitude:</strong> {earthquake.magnitude.toFixed(1)}<br />
                  <strong>Depth:</strong> {earthquake.depth.toFixed(1)} km<br />
                  <strong>Time:</strong> {formatDateTime(earthquake.time)}<br />
                  <strong>Location:</strong> {earthquake.latitude.toFixed(3)}°, {earthquake.longitude.toFixed(3)}°
                </div>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}