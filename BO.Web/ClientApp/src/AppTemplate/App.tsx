import React from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import { LinkRoutes } from '../Shared';
import { Login, NotFoundPage, Register } from '../Shared/Components';
import { ContentContainer } from './ContentContainer';
import { Header } from './Header';

const appRoutes = [
  {
    exact: true,
    path: "/",
    component: <Redirect to={LinkRoutes.shows} />
  },
  {
    exact: false,
    path: LinkRoutes.app,
    component: <>
      <Header />
      <ContentContainer />
    </>
  },
  {
    exact: true,
    path: LinkRoutes.login,
    component: <Login />
  },
  {
    exact: true,
    path: LinkRoutes.register,
    component: <Register />
  },
  {
    exact: false,
    path: "*",
    component: <NotFoundPage />
  },
]

export class App extends React.Component {

  render() {
    return (
      <BrowserRouter>
        <div className="app">
          <Switch>
            {
              appRoutes.map((r, index) => (
                <Route key={index} path={r.path} exact={r.exact}>
                  {r.component}
                </Route>
              ))
            }
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}
