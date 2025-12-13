import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function OpenStreetMap({ userLocation, storeLocation }) {
  const position = [userLocation.lat, userLocation.lng];
  const storePos = [storeLocation.lat, storeLocation.lng];

  return (
    <MapContainer
      center={position}
      zoom={13}
      style={{ height: "300px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap contributors"
      />

      <Marker position={position}>
        <Popup>You are here</Popup>
      </Marker>

      <Marker position={storePos}>
        <Popup>Store Location</Popup>
      </Marker>

      <Polyline positions={[position, storePos]} />
    </MapContainer>
  );
}
