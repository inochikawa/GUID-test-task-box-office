import React from "react";
import { Route } from "react-router-dom";
import { LinkRoutes } from "../../Shared";
import { ShowsList } from "./Shows";

export const MainModule = () => {
    return (
        <>
            <Route path={LinkRoutes.shows} exact={true}>
                <ShowsList />
            </Route>
        </>
    );
};