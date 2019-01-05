import * as Actions from '../actions';
import { SongState, IAction, Track, Instrument } from '../interfaces';

const songInitialState = {
  song: null,
  assetPack: null,
  instrumentName: null,
  trackList: [],
  instrumentList: [],
  activeNotes: [],
};

const song = (state: SongState = songInitialState, action: IAction<any>) => {
  if (action.type === Actions.CONFIG_LOADED) {
    const {
      song,
      assetPack,
      instrumentName,
    } = action.payload;

    let trackList: Array<string> = [];
    let instrumentList: Array<string> = [];
    if (song !== null) {
      trackList = song.tracks.map((t: Track) => t.name);
    }
    if (assetPack !== null) {
      instrumentList = assetPack.instruments.map((i: Instrument) => i.name);
    }
    
    return {
      ...state,
      song,
      assetPack,
      instrumentName,
      trackList,
      instrumentList,
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
  }
  return state;
};

export {
  song,
  songInitialState,
};