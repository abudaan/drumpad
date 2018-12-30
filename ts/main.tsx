import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import getStore from './reducers/store';
import Controls from './containers/controls';
import Song from './containers/song';

const store = getStore();

render(
  <Provider store={store}>
    <div>
      <Controls></Controls>
      <Song></Song>
    </div>
  </Provider>,
  document.getElementById('container')
);
