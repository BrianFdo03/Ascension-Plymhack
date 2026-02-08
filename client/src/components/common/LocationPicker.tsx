import React, { useState, useRef } from 'react';
import { Map as MapIcon, X } from 'lucide-react';
import { Autocomplete, GoogleMap, Marker } from '@react-google-maps/api';

export interface LocationData {
    address: string;
    lat: number;
    lng: number;
}

interface LocationPickerProps {
    label: string;
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
    onLocationSelect?: (data: LocationData) => void;
    isLoaded: boolean;
}

const mapContainerStyle = {
    width: '100%',
    height: '400px'
};

const defaultCenter = {
    lat: 6.9271, // Colombo
    lng: 79.8612
};

const LocationPicker: React.FC<LocationPickerProps> = ({ label, placeholder, value, onChange, onLocationSelect, isLoaded }) => {
    const [isMapOpen, setIsMapOpen] = useState(false);
    const [mapCenter, setMapCenter] = useState(defaultCenter);
    const [markerPosition, setMarkerPosition] = useState(defaultCenter);
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

    const handlePlaceChanged = () => {
        if (autocompleteRef.current) {
            const place = autocompleteRef.current.getPlace();

            // 1. Update text input
            if (place.formatted_address) {
                onChange(place.formatted_address);
            }

            // 2. Update map view if geometry exists
            if (place.geometry && place.geometry.location) {
                const lat = place.geometry.location.lat();
                const lng = place.geometry.location.lng();
                const newPos = { lat, lng };

                setMapCenter(newPos);
                setMarkerPosition(newPos);
                setIsMapOpen(true); // Auto-open map on selection

                // 3. Notify parent
                if (onLocationSelect) {
                    onLocationSelect({
                        address: place.formatted_address || "",
                        lat,
                        lng
                    });
                }
            }
        }
    };

    const handleMapClick = (e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
            const lat = e.latLng.lat();
            const lng = e.latLng.lng();
            setMarkerPosition({ lat, lng });

            // Reverse Geocoding
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode({ location: { lat, lng } }, (results, status) => {
                let address = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
                if (status === "OK" && results && results[0]) {
                    address = results[0].formatted_address;
                }
                onChange(address);
                if (onLocationSelect) {
                    onLocationSelect({ address, lat, lng });
                }
            });
        }
    };

    const confirmLocation = () => {
        setIsMapOpen(false);
    };

    return (
        <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">{label}</label>
            <div className="relative group">
                {isLoaded ? (
                    <Autocomplete
                        onLoad={autocomplete => { autocompleteRef.current = autocomplete; }}
                        onPlaceChanged={handlePlaceChanged}
                    >
                        <input
                            type="text"
                            placeholder={placeholder || "Search location..."}
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            className="w-full pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm placeholder:text-slate-400"
                        />
                    </Autocomplete>
                ) : (
                    <input
                        type="text"
                        placeholder="Loading maps..."
                        disabled
                        className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-500"
                    />
                )}

                <button
                    type="button"
                    onClick={() => setIsMapOpen(true)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
                    title="Pick from Map"
                >
                    <MapIcon size={16} />
                </button>
            </div>

            {/* Map Modal */}
            {isMapOpen && isLoaded && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col">
                        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white z-10">
                            <h3 className="font-semibold text-slate-900">Pick Location</h3>
                            <button onClick={() => setIsMapOpen(false)} className="p-1 hover:bg-slate-100 rounded-lg">
                                <X size={20} className="text-slate-500" />
                            </button>
                        </div>

                        <div className="relative h-[400px] w-full bg-slate-100">
                            <GoogleMap
                                mapContainerStyle={mapContainerStyle}
                                center={mapCenter}
                                zoom={13}
                                onClick={handleMapClick}
                                options={{
                                    streetViewControl: false,
                                    mapTypeControl: false,
                                }}
                            >
                                <Marker position={markerPosition} />
                            </GoogleMap>
                        </div>

                        <div className="p-4 border-t border-slate-100 flex justify-end gap-2 bg-slate-50">
                            <button
                                onClick={() => setIsMapOpen(false)}
                                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmLocation}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm"
                            >
                                Confirm Location
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LocationPicker;
