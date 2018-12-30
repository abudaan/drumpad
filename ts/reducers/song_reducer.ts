import * as Actions from '../actions';
import {ReduxAction} from '../interfaces';

const songInitialState = {
  sequencerReady: false,
  loop: true,
  beats: 8,
  minBeats: 4,
  maxBeats: 16,
  sounds: 8,
  minSounds: 4,
  maxSounds: 16,
  tempo: 120,
  minTempo: 80,
  maxTempo: 200,
};

const song = (state = songInitialState, action:ReduxAction) => {
  if (action.type === Actions.SEQUENCER_READY) {
    return {
      ...state,
      sequencerReady: true,
    };
  } else if (action.type === Actions.UPDATE_BEATS) {
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
  } else if (action.type === Actions.UPDATE_POSITION) {
    return {
      ...state,
      position: action.payload.position,
    };
  }
  return state;
};

export {
  song,
  songInitialState,
};