import React, { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

function MapDisplay() {
  const mapDivRef = useRef(null);

  useEffect(() => {
    const loader = new Loader({
      apiKey: import.meta.env.VITE_REACT_APP_Maps_API_KEY,
      version: 'weekly',
      libraries: ['places'], // Add libraries if needed later
    });
    loader.load()
      .then(async (google) => {
        const mapOptions = {
          center: { lat: 0.3476, lng: 32.5825 }, // Kampala, Uganda
          zoom: 12,
        };
        const map = new google.maps.Map(mapDivRef.current, mapOptions);
        // You can store 'map' in state or ref if needed later

        // Check if Geolocation is supported
        if (navigator.geolocation) {
          console.log("Geolocation is supported. Trying to get position...");
          navigator.geolocation.getCurrentPosition(
            (position) => {
              // Success: Got the position
              const userPosition = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              };

              console.log("User location found:", userPosition);

              // Center the map on the user's position
              map.setCenter(userPosition);
              map.setZoom(15); // Zoom in closer

              // Add a marker at the user's position
              new google.maps.Marker({
                position: userPosition,
                map: map,
                title: "Your Location",
              });

              // --- Initialize Places Autocomplete with location bias ---
              const addressInput = document.getElementById('address-input');
              if (addressInput) {
                const autocomplete = new google.maps.places.Autocomplete(addressInput, {
                  fields: ["geometry", "name"],
                  bounds: map.getBounds(),
                  strictBounds: false,
                  location: userPosition,
                  radius: 50000 // 50km
                });
                autocomplete.addListener('place_changed', () => {
                  const place = autocomplete.getPlace();
                  if (place.geometry && place.geometry.location) {
                    map.setCenter(place.geometry.location);
                    map.setZoom(15);
                    new google.maps.Marker({
                      position: place.geometry.location,
                      map: map,
                      title: place.name
                    });
                    console.log("Place selected:", place.name, place.geometry.location.toString());
                  } else {
                    console.log("Autocomplete returned place with no geometry");
                  }
                });
              } else {
                console.error("Could not find address input element with ID 'address-input'");
              }
            },
            (error) => {
              // Error: Failed to get position
              console.error("Error getting user location:", error.code, error.message);
              alert("Could not get your location. Please ensure location services are enabled and permission is granted. Map will remain centered on Kampala.");
            },
            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 0
            }
          );
        } else {
          // Geolocation is not supported by this browser
          console.error("Geolocation is not supported by this browser.");
          alert("Geolocation is not supported by this browser. Map will remain centered on Kampala.");
        }


      })
      .catch((e) => {
        console.error('Error loading Google Maps API:', e);
      });
  }, []);

  return (
    <div
      ref={mapDivRef}
      style={{ height: '400px', width: '100%' }}
    ></div>
  );
}

export default MapDisplay;
