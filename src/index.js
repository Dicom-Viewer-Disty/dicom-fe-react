import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "react-datepicker/dist/react-datepicker.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "antd/dist/antd.min.css";
import "./styles/index.css";
import axios from "axios";
import initCornerstone from "./components/cornerstone/InitCornerstone";
import "./index.css";
axios.defaults.withCredentials = true;
initCornerstone();
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
reportWebVitals();
