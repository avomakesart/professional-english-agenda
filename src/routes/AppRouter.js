import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Login } from "../components/auth/Login";
import { Register } from "../components/auth/Register";
import { AddClient } from "../components/AddClient";
import { Profile } from "../components/ui/Profile";
import { Home } from "../components/Home";
import {Error } from "../components/ui/Error"
import authService from "../services/auth-service";
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";

export default function AppRouter() {
  const currentUser = authService.getCurrentUser();
  return (
    <>
      <Router>
        <Switch>
          <PrivateRoute
            exact
            path="/"
            component={Home}
            isAuthenticated={!!currentUser}
          />
          <PrivateRoute
            exact
            path="/agregar-cliente"
            component={AddClient}
            isAuthenticated={!!currentUser}
          />
          <PublicRoute
            exact
            path="/iniciar-sesion"
            component={Login}
            isAuthenticated={!!currentUser}
          />
          <PublicRoute
            exact
            path="/registrar"
            component={Register}
            isAuthenticated={!!currentUser}
          />
          <PrivateRoute
            exact
            path="/perfil"
            component={Profile}
            isAuthenticated={!!currentUser}
          />

<Route exact path="*" component={Error} />
        </Switch>
      </Router>
    </>
  );
}
