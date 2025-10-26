import React, { useEffect, useRef, useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import LocationPinIcon from './icons/LocationPinIcon';
import TruckIcon from './icons/TruckIcon';

declare const L: any; // Use Leaflet from the global scope

interface MapProps {
  pickupAddr?: string;
  dropAddr?: string;
  pickupLatLng?: [number, number];
  dropLatLng?: [number, number];
  simulationDuration: number;
}

const Map: React.FC<MapProps> = ({ pickupLatLng, dropLatLng, simulationDuration }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const truckMarkerRef = useRef<any>(null);

  const createDivIcon = (iconComponent: React.ReactElement) => {
    return L.divIcon({
      html: ReactDOMServer.renderToStaticMarkup(iconComponent),
      className: 'custom-map-icon',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    });
  };

  // Initialize map
  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current && pickupLatLng && dropLatLng) {
      const map = L.map(mapContainerRef.current).setView(pickupLatLng, 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      mapRef.current = map;
      
      // Add markers
      const startIcon = createDivIcon(<div className="text-green-600"><LocationPinIcon /></div>);
      const endIcon = createDivIcon(<div className="text-red-600"><LocationPinIcon /></div>);
      
      L.marker(pickupLatLng, { icon: startIcon }).addTo(map);
      L.marker(dropLatLng, { icon: endIcon }).addTo(map);

      // Add route line
      const route = L.polyline([pickupLatLng, dropLatLng], { color: 'rgb(79 70 229)', weight: 5 }).addTo(map);
      map.fitBounds(route.getBounds().pad(0.1));

      // Add truck marker
      const truckIcon = createDivIcon(<div className="text-slate-800 -rotate-90"><TruckIcon /></div>);
      truckMarkerRef.current = L.marker(pickupLatLng, { icon: truckIcon }).addTo(map);
    }
    
    // Cleanup on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [pickupLatLng, dropLatLng]);
  
  // Animation effect
  useEffect(() => {
    if (!mapRef.current || !truckMarkerRef.current || !pickupLatLng || !dropLatLng) return;

    const startTime = Date.now();
    let animationFrameId: number;

    const animate = () => {
      const elapsedTime = Date.now() - startTime;
      const progress = Math.min(1, elapsedTime / simulationDuration);

      const lat = pickupLatLng[0] + (dropLatLng[0] - pickupLatLng[0]) * progress;
      const lng = pickupLatLng[1] + (dropLatLng[1] - pickupLatLng[1]) * progress;
      
      truckMarkerRef.current.setLatLng([lat, lng]);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };

  }, [pickupLatLng, dropLatLng, simulationDuration]);

  return (
    <div className="h-96 w-full rounded-lg overflow-hidden border border-slate-300" ref={mapContainerRef}></div>
  );
};

export default Map;