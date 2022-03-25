import { Route, Routes } from "react-router-dom";
import React from "react";
import routes from "./routes";
import Dashboard from "./pages/Dashboard";


const Router = () => {
    return (
        <div>
            <Routes>
                {routes.map((route) => (
                    <Route
                        key={route.path}
                        exact={true}
                        element={route.element}
                        path={route.path}
                    />
                ))}
                <Route exact element={<Dashboard />} path="*" />
            </Routes>
        </div>
    );
};

export default Router;
