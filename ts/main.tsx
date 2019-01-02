import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import getStore from './reducers/store';
import Grid from './components/grid';
import Song from './containers/song';
import Controls from './containers/controls';
import { loadInstrument, loadMIDIFile, loadAssetPack } from './actions';

const store = getStore();

render(
  <Provider store={store}>
    <Song 
      configUrl="./data/config.json"
      midiFile={null}
      assetPack={null}
      loop={true}
      playing={false}
      tempo={120}
    ></Song>
    <Controls></Controls>
    <Grid></Grid>
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