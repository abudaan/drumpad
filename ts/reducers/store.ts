import {compose, applyMiddleware, createStore, combineReducers} from 'redux';
import {createLogger} from 'redux-logger';
// import thunkMiddleware from 'redux-thunk'
import {song, songInitialState} from './song_reducer';

const combinedReducers = combineReducers({ song });
const initialState = {
  song: songInitialState,
};

const getStore = () => {
  return createStore(
    combinedReducers,
    initialState,
    compose(
      applyMiddleware(
        createLogger({collapsed: true}),
      ),
    ),
  );
};

export default getStore;