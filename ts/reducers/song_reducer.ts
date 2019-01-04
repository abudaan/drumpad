import * as Actions from '../actions';
import { SongState, IAction } from '../interfaces';

const songInitialState = {
  playing: false,
  stopped: true,
  loop: true,
  tempo: 120,
  tracks: [],
  activeNotes: [],
};

const song = (state: SongState = songInitialState, action: IAction<any>) => {
  if (action.type === Actions.SEQUENCER_PLAY) {
    return {
      ...state,
      playing: !state.playing,
      stopped: false,
    };
  } else if (action.type === Actions.SEQUENCER_STOP) {
    return {
      ...state,
      playing: false,
      stopped: true,
    };
  } else if (action.type === Actions.UPDATE_TEMPO) {
    return {
      ...state,
      tempo: action.payload.tempo
    };
  } else if (action.type === Actions.SET_LOOP) {
    return {
      ...state,
      loop: action.payload.loop,
    };
  } else if (action.type === Actions.UPDATE_POSITION) {
    return {
      ...state,
      ...action.payload.position,
    };
  }
  return state;
};

export {
  song,
  songInitialState,
};