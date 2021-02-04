import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux'
import store from './Redux/store'
import 'emoji-mart/css/emoji-mart.css'




ReactDOM.render(
  <BrowserRouter>
  <Provider store = {store}>
  <React.StrictMode>
    <App />
  </React.StrictMode>
  </Provider>
  </BrowserRouter>,
  document.getElementById('root')
);

