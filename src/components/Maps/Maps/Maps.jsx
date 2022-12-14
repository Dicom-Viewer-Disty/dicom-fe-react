import React, { Component } from "react";
import { render } from "react-dom";
import Map from "../Map/Map";

const googleMapsApiKey = "AIzaSyBO5xA5OnHl8azE2S-FgpwqfUOqafF6U9c";
export const Maps = (props) => {
  const { places } = props;

  const { loadingElement, containerElement, mapElement, defaultCenter, defaultZoom } = props;
  return (
    <Map
      googleMapURL={"https://maps.googleapis.com/maps/api/js?key=" + googleMapsApiKey + "&libraries=geometry,drawing,places"}
      markers={places}
      loadingElement={loadingElement || <div style={{ height: `100%` }} />}
      containerElement={containerElement || <div style={{ height: "400px" }} />}
      mapElement={mapElement || <div style={{ height: `100%` }} />}
      defaultCenter={defaultCenter}
      defaultZoom={defaultZoom || 11}
      options={{
        polylineOptions: {
          strokeOpacity: 1,
          strokeColor: "red",
        },
      }}
    />
  );
};
