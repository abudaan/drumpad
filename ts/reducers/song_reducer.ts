import * as Actions from '../actions';
import { SongState, IAction, Track, Instrument, MIDIFileJSON } from '../interfaces';
import isNil from 'ramda/es/isNil';

const songInitialState = {
  song: null,
  instrumentName: null,
  trackList: [],
  midiFileList: [],
  instrumentList: [],
  activeNotes: [],
};

const song = (state: SongState = songInitialState, action: IAction<any>) => {
  if (action.type === Actions.CONFIG_LOADED) {
    const {
      song,
      assetPack,
      midiFileList,
      instrumentList,
    } = action.payload;    
    return {
      ...state,
      song,
      assetPack,
      trackList: song.tracks.map((t: Track) => t.name),
      midiFileList,
      instrumentList,
    };
  } else if (action.type === Actions.ASSETPACK_LOADED) {
    return {
      ...state,
      assetPack: action.payload.assetPack,
      midiFileList: action.payload.midiFileList,
      instrumentList: action.payload.instrumentList,
    };
  } else if (action.type === Actions.MIDIFILE_LOADED) {
    const { song } = action.payload;
    return {
      ...state,
      song,
      trackList: song.tracks.map((t: Track) => t.name),
      midiFileList: action.payload.midiFileList,
    };
  } else if (action.type === Actions.UPDATE_POSITION) {
    return {
      ...state,
      ...action.payload.position,
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
  } else if (action.type === Actions.SET_MIDIFILE) {
    return {
      ...state,
      activeNotes: [],
      song: action.payload.song,
    };
  }
  return state;
};

export {
  song,
  songInitialState,
};