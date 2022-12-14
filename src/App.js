import React, { useEffect, useState } from "react";
import { Suspense } from "react";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import { APP_ROUTE } from "./routes";
import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/PublicRoute";
import { Skeleton } from "antd";
import "./styles/App.css";

const App = () => {
  return (
    <Suspense fallback={<Skeleton />}>
      {/* <Notification /> */}
      <Router>
        <Switch>
          {APP_ROUTE.map((value, index) => {
            if (value.private) {
              return <PrivateRoute key={value.name} component={value.component} path={value.path} exact={value.exact} />;
            } else {
              return <PublicRoute key={value.name} restricted={value.restricted} path={value.path} component={value.component} exact={value.exact} />;
            }
          })}
        </Switch>
      </Router>
    </Suspense>
  );
};

export default App;
