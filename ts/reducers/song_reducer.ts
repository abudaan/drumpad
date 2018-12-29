import * as Actions from '../actions';
import {ReduxAction} from '../interfaces';

const songInitialState = {
  bars: 8,
  columns: 8,
  loop: true,
  minBars: 4,
  maxBars: 16,
  minSounds: 4,
  maxSounds: 16,
};

const song = (state = songInitialState, action:ReduxAction) => {
  if (action.type === Actions.UPDATE_BEATS) {
    return {
      ...state,
      row: action.payload.row,
    };
  } else if (action.type === Actions.UPDATE_SOUNDS) {
    return {
      ...state,
      columns: action.payload.columns,
    };
  } else if (action.type === Actions.UPDATE_TEMPO) {
    return {
      ...state,
      tempo: action.payload.tempo,
    };
  } else if (action.type === Actions.UPDATE_LOOP) {
    return {
      ...state,
      loop: action.payload.tempo,
    };
  }
  return state;
};

export {
  song,
  songInitialState,
};