import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import getStore from './reducers/store';
import App from './containers/app';
import { loadInstrument, loadMIDIFile, loadAssetPack } from './actions';

const store = getStore();

render(
  <Provider store={store}>
    <App
      configUrl="./data/config.json"
    ></App>
  </Provider>,
  document.getElementById('container')
);

// simulate human interaction
// setTimeout(() => {
//   store.dispatch(loadAssetPack('./data/Kit-Jungle.json')).then(() => {
//     store.dispatch(loadMIDIFile('./data/track9.mid'));
//   })
//   // store.dispatch(loadMIDIFile('./data/track9.mid'));
// }, 3000)