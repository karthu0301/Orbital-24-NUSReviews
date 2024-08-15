import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import L from 'leaflet';
import './FoodMapPage.css';

const center = {
  lat: 1.2966,
  lng: 103.7764,
};


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.6.0/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.6.0/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.6.0/dist/images/marker-shadow.png',
});

const FoodMapPage = () => {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    const fetchFoodPlaces = async () => {
      const overpassUrl = 'https://overpass-api.de/api/interpreter';
      const query = `
        [out:json];
        node
          [amenity=restaurant]
          (around:1000,${center.lat},${center.lng});
        out body;
        >;
        out skel qt;
      `;
      try {
        const response = await axios.get(overpassUrl, { params: { data: query } });
        const data = response.data.elements.map(place => ({
          name: place.tags.name || "Unnamed Food Place",
          lat: place.lat,
          lng: place.lon,
          address: place.tags.address ? `${place.tags.address.street}, ${place.tags.address.city}` : "No address available",
          openingHours: place.tags.opening_hours || "No opening hours available",
          rating: place.tags.rating || "No rating available"
        }));
        setPlaces(data);
      } catch (error) {
        console.error('Error fetching food places:', error);
      }
    };
    
    fetchFoodPlaces();
  }, []);

  return (
    <div className="map-container">
      <h2 className="map-title">Food Options Near You</h2>
      <MapContainer center={center} zoom={15} style={{ height: "90vh", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          maxZoom={22}
          maxNativeZoom={19}
        />
        {places.map((place, index) => (
          <Marker key={index} position={[place.lat, place.lng]}>
            <Popup>
            <div>
              <strong>{place.name}</strong><br />
              <strong>Address:</strong> {place.address}<br />
              <strong>Opening Hours:</strong> {place.openingHours}<br />
              <strong>Rating:</strong> {place.rating}
            </div>
      </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default FoodMapPage;
