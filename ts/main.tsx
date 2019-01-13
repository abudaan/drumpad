import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import getStore from './reducers/store';
import App from './containers/app';

const store = getStore();

render(
  <Provider store={store}>
    <App
      configUrl="./data/config.json"
    ></App>
  </Provider>,
  document.getElementById('container')
);

// document.oncontextmenu = () => {};
// document.addEventListener('touchstart', function (e) { e.preventDefault() }, false);
// document.addEventListener('touchmove', function (e) { e.preventDefault() }, false);