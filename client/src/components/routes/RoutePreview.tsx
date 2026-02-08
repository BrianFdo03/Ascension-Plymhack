import React, { useState, useEffect } from 'react';
import { GoogleMap, DirectionsRenderer } from '@react-google-maps/api';

export interface RouteMapPreviewProps {
    startPoint: { lat: number; lng: number } | null;
    endPoint: { lat: number; lng: number } | null;
    stops: { lat: number; lng: number }[];
    isLoaded: boolean;
}

const mapContainerStyle = {
    width: '100%',
    height: '300px',
    borderRadius: '12px'
};

const defaultCenter = {
    lat: 6.9271, // Colombo
    lng: 79.8612
};

const RouteMapPreview: React.FC<RouteMapPreviewProps> = ({ startPoint, endPoint, stops, isLoaded }) => {
    const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);

    useEffect(() => {
        if (isLoaded && startPoint && endPoint) {
            const directionsService = new google.maps.DirectionsService();

            const waypoints = stops.map(stop => ({
                location: stop,
                stopover: true
            }));

            directionsService.route({
                origin: startPoint,
                destination: endPoint,
                waypoints: waypoints,
                travelMode: google.maps.TravelMode.DRIVING
            }, (result, status) => {
                if (status === google.maps.DirectionsStatus.OK) {
                    setDirections(result);
                } else {
                    console.error(`error fetching directions ${result}`);
                }
            });
        }
    }, [isLoaded, startPoint, endPoint, stops]);

    if (!isLoaded) return <div className="h-[300px] bg-slate-100 rounded-xl animate-pulse flex items-center justify-center text-slate-400">Loading Map...</div>;

    return (
        <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={defaultCenter}
                zoom={10}
                options={{
                    disableDefaultUI: true,
                    zoomControl: true,
                }}
            >
                {directions && <DirectionsRenderer directions={directions} />}
            </GoogleMap>
        </div>
    );
};

export default RouteMapPreview;
