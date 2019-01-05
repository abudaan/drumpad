import * as Actions from '../actions';
import { ControlsState, IAction } from '../interfaces'

const controlsInitialState = {
  playing: false,
  stopped: true,
  loop: true,
  tempo: 120,
  activeNotes: [],
  controlsEnabled: false,
  trackIndex: 0,
  instrumentIndex: 0,
  tempoTmp: 120,
  tempoMin: 20,
  tempoMax: 300,
  notes: [60, 61, 62, 63],
  beats: [0, 1, 2, 3, 4, 5, 6, 7].map((v) => v * (960 / 8)), // default ppq / granularity
};

const controls = (state: ControlsState = controlsInitialState, action: IAction<any>) => {
  if (action.type === Actions.LOADING) {
    return {
      ...state,
      controlsEnabled: false,
    };
  } else if (action.type === Actions.CONFIG_LOADED) {
    return {
      ...state,
      controlsEnabled: true,
    };
  } else if (action.type === Actions.ASSETPACK_LOADED) {
    return {
      ...state,
      controlsEnabled: true,
    };
  } else if (action.type === Actions.MIDIFILE_LOADED) {
    return {
      ...state,
      controlsEnabled: true,
    };
  } else if (action.type === Actions.CHOOSING_TEMPO) {
    return {
      ...state,
      tempoTmp: action.payload.tempoTmp,
    };
  } else if (action.type === Actions.SET_TRACK) {
    return {
      ...state,
      trackIndex: action.payload.trackIndex,
    };
  } else if (action.type === Actions.SET_INSTRUMENT) {
    return {
      ...state,
      instrumentIndex: action.payload.instrumentIndex,
    };
  } else   if (action.type === Actions.SEQUENCER_PLAY) {
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
  }
  return state;
};

export {
  controls,
  controlsInitialState,
};