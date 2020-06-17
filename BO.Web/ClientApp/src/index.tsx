import React from 'react';
import ReactDOM from 'react-dom';
import './Styles/index.scss';
import { App } from './AppTemplate';
import * as serviceWorker from './serviceWorker';
import "reflect-metadata";
import { Container } from 'aurelia-framework';
import { HttpClient } from "aurelia-fetch-client";
import { ApiService, UserService } from "./Shared/Services";

const registerServices = (): Container => {
  var container = new Container();

  const httpClient = new HttpClient();
  httpClient.configure(c => {
    c.withBaseUrl("api/v1")
  });

  const apiService = new ApiService();
  const userService = new UserService(apiService);

  container.registerInstance(HttpClient, httpClient);
  container.registerInstance(ApiService, apiService);
  container.registerInstance(UserService, userService);

  return container;
}

// register services globally
registerServices().makeGlobal();

ReactDOM.render(
  <App />,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
