import * as Actions from '../actions/actions';
import { SongState, IAction, Track } from '../interfaces';
import { createGrid, updateGrid } from './grid_utils';

const songInitialState = {
  grid: null,
  song: null,
  songList: [],
  trackList: [],
  activeNotes: [],
  instrumentList: [],
  instrumentName: null,
  granularity: 8,
  trackIndex: 0,
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
    const { grid, granularity: newGranularity } = createGrid(song, 0, granularity);

    return {
      ...state,
      song,
      grid,
      granularity: newGranularity,
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
    if (state.song !== null && state.grid !== null) {
      // const trackId = state.song.tracks[state.trackIndex].id;
      // const grid = updateGrid(state.grid, trackId, action.payload.position.activeNotes);
      return {
        ...state,
        ...action.payload.position,
        // grid,
      };
    }
    return {
      ...state,
      ...action.payload.position,
    }
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
    if (state.song !== null) {
      const { trackIndex } = action.payload;
      const { grid, granularity: newGranularity } = createGrid(state.song, trackIndex, state.granularity);
      return {
        ...state,
        trackIndex,
        grid,
        granularity: newGranularity
      };
    }
    return state;
  }
  return state;
};

export {
  song,
  songInitialState,
};