import { compose, applyMiddleware, createStore, combineReducers } from 'redux';
import { createLogger } from 'redux-logger';
import thunkMiddleware from 'redux-thunk'
import { data, dataInitialState } from './app_reducer';
import { song, songInitialState } from './song_reducer';

const combinedReducers = combineReducers({ data, song });
const initialState = {
  data: dataInitialState,
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