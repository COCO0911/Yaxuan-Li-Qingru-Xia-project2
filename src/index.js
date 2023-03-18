import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { HashRouter, BrowserRouter as Router, Routes, Route, Switch, useRoutes } from 'react-router-dom';
import { store } from "./store/index";
import { Provider } from "react-redux";
import reportWebVitals from './reportWebVitals';
import Home from './page/home';
import Game from './page/game';
import Rulepage from './page/rulePage';
const root = ReactDOM.createRoot(document.getElementById('root'));
const AppRotes = () => {
  let routes = useRoutes([
    { path: "/", element: <Home /> },
    { path: "/home", element: <Home /> },
    { path: "/Game/:type", element: <Game /> },
    { path: "/rule", element: <Rulepage /> },
    {
      path: "*", element: () => {
        {
          <main style={{ padding: '1rem' }}>
            <p>There's nothing here!</p>
          </main>
        }
      }
    },
  ]);
  return routes;
};
root.render(
  <Provider store={store}>
    <HashRouter>
      <AppRotes />
    </HashRouter>
  </Provider>



);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
