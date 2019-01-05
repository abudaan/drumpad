import { compose, applyMiddleware, createStore, combineReducers } from 'redux';
import { createLogger } from 'redux-logger';
import thunkMiddleware from 'redux-thunk'
import { controls, controlsInitialState } from './controls_reducer';
import { song, songInitialState } from './song_reducer';

const combinedReducers = combineReducers({ controls, song });
const initialState = {
  controls: controlsInitialState,
  song: songInitialState,
};

const getStore = () => {
  return createStore(
    combinedReducers,
    initialState,
    compose(
      applyMiddleware(
        thunkMiddleware,
        // createLogger({ collapsed: true }),
      ),
    ),
  );
};

export default getStore;