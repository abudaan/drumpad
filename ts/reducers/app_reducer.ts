import * as Actions from '../actions';
import { AppState, IAction } from '../interfaces'

const appInitialState = {
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
  }
  return state;
};

export {
  app,
  appInitialState,
};