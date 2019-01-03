import * as Actions from '../actions';
import { AppState, IAction } from '../interfaces'

const appInitialState = {
  controlsEnabled: false,
  assetPack: null,
  instrument: null,
  midiFile: null,
  tracks: [],
  trackIndex: 0,
  instrumentIndex: 0,
};

const app = (state: AppState = appInitialState, action: IAction<any>) => {
  if (action.type === Actions.LOADING) {
    return {
      ...state,
      songReady: false,
    };
  } else if (action.type === Actions.CONFIG_LOADED) {
    return {
      ...state,
      ...action.payload.data,
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
  } else if (action.type === Actions.SONG_READY) {
    return {
      ...state,
      ...action.payload,
      controlsEnabled: true,
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