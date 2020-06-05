import React from "react";
import { Route, BrowserRouter as Router } from "react-router-dom";

import CreatePoint from "./pages/CreatePoint/createPoint";
import Home from "./pages/Home/home";

const Routes = () => {
    return (
        <Router>
            <Route component={Home} path="/" exact />
            <Route component={CreatePoint} path="/cadastro" />
        </Router>
    )

}
export default Routes;