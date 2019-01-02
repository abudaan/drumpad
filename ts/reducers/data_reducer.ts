import * as Actions from '../actions';
import { DataState, IAction } from '../interfaces'

const dataInitialState = {
  songReady: false,
  assetPack: null,
  instrument: null,
  midiFile: null,
  track: 0,
  tracks: [],
  instrumentIndex: 0,
};

const data = (state: DataState = dataInitialState, action: IAction<any>) => {
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