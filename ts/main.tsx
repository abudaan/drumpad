import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import getStore from './reducers/store';
import App from './containers/app';
import { loadInstrument, loadMIDIFile, loadAssetPack, loadConfig } from './actions/actions';

const store = getStore();

render(
  <Provider store={store}>
    <App
      configUrl="./data/config.json"
    ></App>
  </Provider>,
  document.getElementById('container')
);

// store.dispatch(loadConfig('./data/config.json'));

// simulate human interaction
setTimeout(() => {
  // store.dispatch(loadAssetPack('./data/Kit-Jungle.json')).then(() => {
  //   store.dispatch(loadMIDIFile('./data/track9.mid'));
  // })
  // store.dispatch(loadMIDIFile('./data/track9.mid'));
  // store.dispatch(loadMIDIFile('./data/track14.mid'));
  // store.dispatch(loadAssetPack('./data/Kit-Jungle.json'));
}, 3000)