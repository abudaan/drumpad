import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import getStore from './reducers/store';
import Song from './containers/song';
import Controls from './containers/controls';
import { loadInstrument, loadMIDIFile, loadAssetPack } from './actions';

const store = getStore();

render(
  <Provider store={store}>
    <Song configUrl="./data/config.json"></Song>
    <Controls></Controls>
  </Provider>,
  document.getElementById('container')
);

// simulate human interaction
// setTimeout(() => {
//   store.dispatch(loadAssetPack('./data/Kit-Jungle.json')).then(() => {
//     store.dispatch(loadMIDIFile('./data/track9.mid'));
//   })
// }, 10000)