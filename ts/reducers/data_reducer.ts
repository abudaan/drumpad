import * as Actions from '../actions';
import { DataState, IAction } from '../interfaces'

const dataInitialState = {
  loading: null,
  songReady: false,
  assetPack: null,
  instrument: null,
  midiFile: null,
  tracks: []
};

const data = (state: DataState = dataInitialState, action: IAction<any>) => {
  if (action.type === Actions.LOADING_CONFIG) {
    return {
      ...state,
      loading: 'config',
      songReady: false,
    };
  } else if (action.type === Actions.CONFIG_LOADED) {
    return {
      ...state,
      ...action.payload.data,
      loading: null,
    };
  } else if (action.type === Actions.LOADING_ASSETPACK) {
    return {
      ...state,
      loading: 'assetpack',
      songReady: false,
    };
  } else if (action.type === Actions.ASSETPACK_LOADED) {
    return {
      ...state,
      assetPack: action.payload.assetPack,
      loading: false,
    };
  } else if (action.type === Actions.LOADING_MIDIFILE) {
    return {
      ...state,
      loading: 'midifile',
      songReady: false,
    };
  } else if (action.type === Actions.MIDIFILE_LOADED) {
    return {
      ...state,
      midiFile: action.payload.midiFile,
      loading: false,
    };
  } else if (action.type === Actions.SONG_READY) {
    return {
      ...state,
      tracks: action.payload.tracks,
      songReady: true,
    };
  } else if (action.type === Actions.SET_TRACK) {
    return {
      ...state,
      track: action.payload.track,
    };
  }
  return state;
};

export {
  data,
  dataInitialState,
};