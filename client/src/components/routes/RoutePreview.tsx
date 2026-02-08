import React, { useState, useEffect } from 'react';
import { GoogleMap, DirectionsRenderer, Marker } from '@react-google-maps/api';

export interface RouteMapPreviewProps {
    startPoint: { lat: number; lng: number } | null;
    endPoint: { lat: number; lng: number } | null;
    stops: { lat: number; lng: number }[];
    isLoaded: boolean;
    onDirectionsLoaded?: (details: {
        distanceValue: number;
        distanceText: string;
        durationValue: number;
        durationText: string;
    }) => void;
}

const mapContainerStyle = {
    width: '100%',
    height: '100%',
    minHeight: '300px',
    borderRadius: '12px'
};

const defaultCenter = {
    lat: 6.9271, // Colombo
    lng: 79.8612
};

const RouteMapPreview: React.FC<RouteMapPreviewProps> = ({ startPoint, endPoint, stops, isLoaded, onDirectionsLoaded }) => {
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
                if (status === google.maps.DirectionsStatus.OK && result) {
                    setDirections(result);

                    // Extract distance and duration from the first leg (or sum of legs if multiple)
                    // For simplicity, we'll take the first route's total info
                    const route = result.routes[0];
                    let totalDistance = 0;
                    let totalDuration = 0;

                    if (route && route.legs) {
                        route.legs.forEach(leg => {
                            totalDistance += leg.distance?.value || 0;
                            totalDuration += leg.duration?.value || 0;
                        });

                        // Calculate duration text
                        const hours = Math.floor(totalDuration / 3600);
                        const minutes = Math.round((totalDuration % 3600) / 60);
                        const durationText = hours > 0
                            ? `${hours} hr ${minutes} min`
                            : `${minutes} min`;

                        // Call parent callback if provided
                        if (onDirectionsLoaded) {
                            onDirectionsLoaded({
                                distanceValue: totalDistance, // in meters
                                distanceText: (totalDistance / 1000).toFixed(1) + " km",
                                durationValue: totalDuration, // in seconds
                                durationText: durationText
                            });
                        }
                    }
                } else {
                    console.error(`error fetching directions ${result}`);
                }
            });
        }
    }, [isLoaded, startPoint, endPoint, stops, onDirectionsLoaded]);

    if (!isLoaded) return <div className="h-full min-h-[300px] bg-slate-100 rounded-xl animate-pulse flex items-center justify-center text-slate-400">Loading Map...</div>;

    return (
        <div className="h-full min-h-[300px] border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={defaultCenter}
                zoom={10}
                options={{
                    disableDefaultUI: true,
                    zoomControl: true,
                }}
            >
                {directions && (
                    <DirectionsRenderer
                        directions={directions}
                        options={{
                            suppressMarkers: true,
                            polylineOptions: {
                                strokeColor: '#2563eb', // Blue-600
                                strokeWeight: 5,
                                strokeOpacity: 0.8
                            }
                        }}
                    />
                )}

                {/* Start Marker - Premium Green Pin */}
                {startPoint && (
                    <Marker
                        position={startPoint}
                        icon={{
                            path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
                            fillColor: "#10B981", // Emerald-500
                            fillOpacity: 1,
                            strokeWeight: 1,
                            strokeColor: "#ffffff",
                            scale: 1.5,
                            anchor: new google.maps.Point(12, 22),
                        }}
                        title="Start Location"
                    />
                )}

                {/* End Marker - Premium Red Pin */}
                {endPoint && (
                    <Marker
                        position={endPoint}
                        icon={{
                            path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
                            fillColor: "#EF4444", // Red-500
                            fillOpacity: 1,
                            strokeWeight: 1,
                            strokeColor: "#ffffff",
                            scale: 1.5,
                            anchor: new google.maps.Point(12, 22),
                        }}
                        title="End Location"
                    />
                )}

                {/* Stops Markers - Sleek Blue Circles */}
                {stops.map((stop, index) => (
                    <Marker
                        key={`stop-${index}`}
                        position={stop}
                        icon={{
                            path: google.maps.SymbolPath.CIRCLE,
                            scale: 6,
                            fillColor: "#3B82F6", // Blue-500
                            fillOpacity: 1,
                            strokeWeight: 2,
                            strokeColor: "#ffffff",
                        }}
                        title={`Stop ${index + 1}`}
                    />
                ))}
            </GoogleMap>
        </div>
    );
};

export default RouteMapPreview;
