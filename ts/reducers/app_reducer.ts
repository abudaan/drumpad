import * as Actions from '../actions';
import { AppState, IAction } from '../interfaces'

const appInitialState = {
  playing: false,
  stopped: true,
  loop: true,
  tempo: 120,
  tracks: [],
  activeNotes: [],
  controlsEnabled: false,
  assetPack: null,
  instrument: null,
  midiFile: null,
  trackList: [],
  trackIndex: 0,
  instrumentIndex: 0,
  tempoTmp: 120,
  tempoMin: 20,
  tempoMax: 300,
  rows: 4,
  columns: 4,
  song: null,
  granularity: 8, // eighth notes
  notes: [60, 61, 62, 63],
  beats: [0, 1, 2, 3, 4, 5, 6, 7].map((v) => v * (960 / 8)), // default ppq / granularity
};

const app = (state: AppState = appInitialState, action: IAction<any>) => {
  if (action.type === Actions.LOADING) {
    return {
      ...state,
    };
  } else if (action.type === Actions.CONFIG_LOADED) {
    return {
      ...state,
      ...action.payload.data,
      controlsEnabled: true,
    };
  } else if (action.type === Actions.ASSETPACK_LOADED) {
    return {
      ...state,
      assetPack: action.payload.assetPack,
    };
  } else if (action.type === Actions.MIDIFILE_LOADED) {
    return {
      ...state,
      midiFile: action.payload.midiFile,
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
  } else if (action.type === Actions.UPDATE_POSITION) {
    return {
      ...state,
      ...action.payload.position,
    };
  }
  return state;
};

export {
  app,
  appInitialState,
};