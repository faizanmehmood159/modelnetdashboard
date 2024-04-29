import React, { useState, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import "mapbox-gl/dist/mapbox-gl.css";

const MapBox = ({ onCoordinatesChange }) => {
  const [coordinates, setCoordinates] = useState({ longitude: 0, latitude: 0 });
  const [addressState, setAddressState] = useState("");

  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1IjoibWFhemtoYWxpZGJoYXR0aSIsImEiOiJjbHFkcTd1NDkwZnRiMmpwandzdTNuZHZjIn0.ng3u6jqasoaJJRa3NnHUIA";

    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-79.4512, 43.6568],
      zoom: 8,
    });

    const coordinatesGeocoder = function (query) {
      fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          query
        )}.json?access_token=${mapboxgl.accessToken}`
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.features.length > 0) {
            const [longitude, latitude] = data.features[0].center;
            const address = data.features[0].place_name;

            setCoordinates({ longitude, latitude, address });
            onCoordinatesChange({ longitude, latitude, address });
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });

      return [];
    };

    map.addControl(
      new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        localGeocoder: coordinatesGeocoder,
        zoom: 4,
        placeholder: "Search for a location",
        mapboxgl: mapboxgl,
        reverseGeocode: true,
      })
    );
  }, [onCoordinatesChange]);

  return (
    <div className="relative h-screen">
      <div id="map" className="h-full w-full">
        {coordinates.address}
      </div>
      <div className="absolute top-0 z-50"></div>
    </div>
  );
};

export default MapBox;
