import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import './FoodMapPage.css';

const mapContainerStyle = {
  width: '100%',
  height: '90vh',
};

const center = {
  lat: 1.2966,
  lng: 103.7764,
};

const places = [
  { name: "Food Place 1", location: { lat: 1.2976, lng: 103.7774 } },
  { name: "Food Place 2", location: { lat: 1.2986, lng: 103.7784 } },
];

const FoodMapPage = () => {
  return (
    <div className="map-container">
      <h2 className="map-title">Food Options Near You</h2>
      <LoadScript googleMapsApiKey="AIzaSyAPPQnvk3pvgNUn2fenzHyMNbgX9YBTw4g">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={15}
        >
          {places.map((place, index) => (
            <Marker key={index} position={place.location} title={place.name} />
          ))}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default FoodMapPage;



// import { useState, useEffect, useRef } from 'react';
// import { GoogleMap, LoadScript, Marker, InfoWindow, Circle } from '@react-google-maps/api';
// import './FoodMapPage.css';
// import axios from 'axios';

// const mapContainerStyle = {
//   width: '100%',
//   height: '80vh',
// };

// const center = {
//   lat: 1.2966, // NUS coordinates
//   lng: 103.7764,
// };

// const radius = 1000; // Radius in meters to search for food places

// const FoodMapPage = () => {
//   const [places, setPlaces] = useState([]);
//   const [selectedPlace, setSelectedPlace] = useState(null);
//   const mapRef = useRef(null);

//   const fetchPlaces = async (bounds) => {
//     const { north, south, east, west } = bounds;
//     const overpassUrl = `https://overpass-api.de/api/interpreter?data=[out:json];node(${south},${west},${north},${east})[amenity=restaurant];out;`;
//     const response = await axios.get(overpassUrl);
//     const fetchedPlaces = response.data.elements.map(element => ({
//       id: element.id,
//       name: element.tags.name,
//       lat: element.lat,
//       lon: element.lon,
//     }));
//     setPlaces(fetchedPlaces);
//   };

//   const handleSearchArea = () => {
//     const bounds = mapRef.current.getBounds();
//     const ne = bounds.getNorthEast();
//     const sw = bounds.getSouthWest();
//     fetchPlaces({
//       north: ne.lat(),
//       south: sw.lat(),
//       east: ne.lng(),
//       west: sw.lng(),
//     });
//   };

//   return (
//     <div className="map-container">
//       <h2 className="map-title">Food Options Near You</h2>
//       <button className="search-area-button" onClick={handleSearchArea}>Search this area</button>
//       <LoadScript googleMapsApiKey="AIzaSyAPPQnvk3pvgNUn2fenzHyMNbgX9YBTw4g">
//         <GoogleMap
//           mapContainerStyle={mapContainerStyle}
//           center={center}
//           zoom={15}
//           onLoad={map => (mapRef.current = map)}
//         >
//           <Marker
//             position={center}
//             title="NUS"
//             icon={{
//               url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
//             }}
//           />
//           {places.map(place => (
//             <Marker
//               key={place.id}
//               position={{ lat: place.lat, lng: place.lon }}
//               title={place.name || 'Unnamed Place'}
//               icon={{
//                 url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
//               }}
//               onClick={() => setSelectedPlace(place)}
//             />
//           ))}
//           {selectedPlace && (
//             <InfoWindow
//               position={{ lat: selectedPlace.lat, lng: selectedPlace.lon }}
//               onCloseClick={() => setSelectedPlace(null)}
//             >
//               <div>
//                 <h3>{selectedPlace.name || 'Unnamed Place'}</h3>
//                 <a
//                   href={`https://www.google.com/maps/search/?api=1&query=${selectedPlace.lat},${selectedPlace.lon}`}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                 >
//                   Proceed to Google Maps
//                 </a>
//               </div>
//             </InfoWindow>
//           )}
//           {places.map(place => (
//             <Circle
//               key={place.id}
//               center={{ lat: place.lat, lng: place.lon }}
//               radius={50} // Adjust radius as needed
//               options={{
//                 fillColor: '#FF0000',
//                 fillOpacity: 0.2,
//                 strokeColor: '#FF0000',
//                 strokeOpacity: 0.5,
//                 strokeWeight: 1,
//               }}
//             />
//           ))}
//         </GoogleMap>
//       </LoadScript>
//     </div>
//   );
// };

// export default FoodMapPage;