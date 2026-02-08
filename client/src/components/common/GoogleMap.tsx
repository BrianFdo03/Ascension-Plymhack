import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';

interface MapLocation {
    lat: number;
    lng: number;
    label?: string;
}

interface GoogleMapProps {
    center: MapLocation;
    markers?: MapLocation[];
    zoom?: number;
    height?: string;
}

const GoogleMap = ({ center, markers = [], zoom = 12, height = '500px' }: GoogleMapProps) => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
        return (
            <div className="flex items-center justify-center h-full bg-gray-100">
                <p className="text-gray-500">Google Maps API key not configured</p>
            </div>
        );
    }

    return (
        <APIProvider apiKey={apiKey}>
            <div style={{ height }}>
                <Map
                    defaultCenter={center}
                    defaultZoom={zoom}
                    gestureHandling="greedy"
                    disableDefaultUI={false}
                >
                    {markers.map((marker, index) => (
                        <Marker
                            key={index}
                            position={{ lat: marker.lat, lng: marker.lng }}
                            title={marker.label}
                        />
                    ))}
                </Map>
            </div>
        </APIProvider>
    );
};

export default GoogleMap;
