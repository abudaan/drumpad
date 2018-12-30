import * as Actions from '../actions';
import {ReduxAction} from '../interfaces';

const songInitialState = {
  beats: 8,
  sounds: 8,
  loop: true,
  minBeats: 4,
  maxBeats: 16,
  minSounds: 4,
  maxSounds: 16,
};

const song = (state = songInitialState, action:ReduxAction) => {
  if (action.type === Actions.UPDATE_BEATS) {
    return {
      ...state,
      beats: parseInt(action.payload.beats, 10)
    };
  } else if (action.type === Actions.UPDATE_SOUNDS) {
    return {
      ...state,
      sounds: parseInt(action.payload.sounds, 10)
    };
  } else if (action.type === Actions.UPDATE_TEMPO) {
    return {
      ...state,
      tempo: parseInt(action.payload.tempo, 10)
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