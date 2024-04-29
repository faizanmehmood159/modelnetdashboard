import React from "react";

const DisplayCoordinates = ({ coordinates }) => {
  return (
    <div>
      <p>Current Coordinates: {`${coordinates.lng}, ${coordinates.lat}`}</p>
    </div>
  );
};

export default DisplayCoordinates;
