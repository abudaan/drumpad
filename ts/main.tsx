import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import getStore from './reducers/store';
import Loader from './containers/loader';
import Song from './containers/song';
import Controls from './containers/controls';

const store = getStore();

render(
  <Provider store={store}>
    <Song configUrl="./data/config.json"></Song>
    <Controls></Controls>
  </Provider>,
  document.getElementById('container')
);
