import {compose, applyMiddleware, createStore, combineReducers} from 'redux';
import {createLogger} from 'redux-logger';
import thunkMiddleware from 'redux-thunk'
import {song, songInitialState} from './song_reducer';
import {samples, samplesInitialState} from './samples_reducer';

const combinedReducers = combineReducers({ song, samples });
const initialState = {
  song: songInitialState,
  samples: samplesInitialState,
};

const getStore = () => {
  return createStore(
    combinedReducers,
    initialState,
    compose(
      applyMiddleware(
        thunkMiddleware,
        createLogger({collapsed: true}),
      ),
    ),
  );
};

export default getStore;