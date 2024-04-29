import React, { useEffect } from "react";
import mapboxgl from "mapbox-gl";

const MapboxMap = () => {
  useEffect(() => {
    mapboxgl.accessToken =
      "pk.eyJ1IjoibWFhemtoYWxpZGJoYXR0aSIsImEiOiJjbHFkcTd1NDkwZnRiMmpwandzdTNuZHZjIn0.ng3u6jqasoaJJRa3NnHUIA";

    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-122.486052, 37.830348],
      zoom: 14,
    });

    map.on("style.load", function () {
      map.on("click", function (e) {
        var coordinates = e.lngLat;

        new mapboxgl.Popup()
          .setLngLat(coordinates)
          .setHTML("you clicked here: <br/>" + coordinates)
          .addTo(map);
      });
    });

    return () => map.remove();
  }, []);

  return <div id="map" style={{ width: "100%", height: "400px" }} />;
};

export default MapboxMap;
