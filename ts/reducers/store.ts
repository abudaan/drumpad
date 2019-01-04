import { compose, applyMiddleware, createStore, combineReducers } from 'redux';
import { createLogger } from 'redux-logger';
import thunkMiddleware from 'redux-thunk'
import { app, appInitialState } from './app_reducer';
import { song, songInitialState } from './song_reducer';

const combinedReducers = combineReducers({ app, song });
const initialState = {
  app: appInitialState,
  song: songInitialState,
};

const getStore = () => {
  return createStore(
    // combinedReducers,
    // initialState,
    app,
    appInitialState,
    compose(
      applyMiddleware(
        thunkMiddleware,
        // createLogger({ collapsed: true }),
      ),
    ),
  );
};

export default getStore;