import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import getStore from './reducers/store';
import Controls from './containers/controls';

const store = getStore();

render(
  <Provider store={store}>
    <div>
      <Controls />
    </div>
  </Provider>,
  document.getElementById('container')
);
