import * as Actions from '../actions';
import { SongState, IAction, Track } from '../interfaces';
import { createGrid } from '../action_grid_utils';

const songInitialState = {
  grid: null,
  song: null,
  songList: [],
  trackList: [],
  activeNotes: [],
  instrumentList: [],
  instrumentName: null,
  granularity: 8,
};

const song = (state: SongState = songInitialState, action: IAction<any>) => {
  if (action.type === Actions.CONFIG_LOADED) {
    const {
      assetPack,
      songList,
      instrumentList,
      granularity,
    } = action.payload;
    const song = songList[0];
    const data = createGrid(song, 0, granularity);

    return {
      ...state,
      song,
      grid: data.grid,
      granularity: data.granularity,
      assetPack,
      songList,
      trackList: song.tracks.map((t: Track) => t.name),
      instrumentList,
    };
  } else if (action.type === Actions.ASSETPACK_LOADED) {
    return {
      ...state,
      assetPack: action.payload.assetPack,
      songList: action.payload.songList,
      instrumentList: action.payload.instrumentList,
    };
  } else if (action.type === Actions.MIDIFILE_LOADED) {
    const { song } = action.payload;
    return {
      ...state,
      song,
      trackList: song.tracks.map((t: Track) => t.name),
      songList: action.payload.songList,
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
  } else if (action.type === Actions.SELECT_SONG) {
    const song = state.songList[action.payload.songIndex];
    return {
      ...state,
      song,
      trackList: song.tracks.map((t: Track) => t.name),
      activeNotes: [],
    };
  } else if (action.type === Actions.SELECT_TRACK) {
    const { grid } = createGrid(state.song, action.payload.trackIndex, state.granularity)
    return {
      ...state,
      grid,
    };
  }
  return state;
};

export {
  song,
  songInitialState,
};