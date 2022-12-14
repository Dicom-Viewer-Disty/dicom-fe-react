import React from "react";
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import MarkerIcon from "../../../assets/images/markerkuliner.png";

export const MapWithAMarker = withScriptjs(
  withGoogleMap((props) => (
    <GoogleMap defaultZoom={15} defaultCenter={{ lat: parseFloat(props.state.lat), lng: parseFloat(props.state.lng) }}>
      <Marker
        icon={{
          url: MarkerIcon,
        }}
        position={{ lat: parseFloat(props.state.lat), lng: parseFloat(props.state.lng) }}
      />
    </GoogleMap>
  ))
);
