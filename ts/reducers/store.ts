import { compose, applyMiddleware, createStore, combineReducers, DeepPartial } from 'redux';
import { createLogger } from 'redux-logger';
import thunkMiddleware from 'redux-thunk'
import { controls, controlsInitialState } from './controls_reducer';
import { song, songInitialState } from './song_reducer';
import { SongState, ControlsState } from '../interfaces';

const combinedReducers = combineReducers({ controls, song });
const initialState: DeepPartial<{controls: ControlsState, song: SongState}> =  {
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
        createLogger({ collapsed: true }),
      ),
    ),
  );
};

export default getStore;