import * as Actions from '../actions/actions';
import { SongState, IAction, Track } from '../interfaces';
import { createGrid } from './grid_utils';
import * as RenderActions from '../components/song';

const songInitialState = {
  grid: null,
  song: null,
  songList: [],
  trackList: [],
  instrumentList: [],
  instrumentName: null,
  granularity: 8,
  granularityTicks: 120,
  trackIndex: 0,
  updateInterval: 0, // in millis
  renderAction: RenderActions.PASS,
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
    const { grid, granularity: newGranularity, updateInterval, granularityTicks } = createGrid(song, 0, granularity);
    
    return {
      ...state,
      song,
      grid,
      granularity: newGranularity,
      granularityTicks,
      updateInterval,
      assetPack,
      songList,
      trackList: song.tracks.map((t: Track) => t.name),
      instrumentList,
      renderAction: RenderActions.SONG,
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
    const { grid, granularity, updateInterval, granularityTicks } = createGrid(song, 0, state.granularity);
    return {
      ...state,
      song,
      trackList: song.tracks.map((t: Track) => t.name),
      trackIndex: 0,
      grid,
      granularity,
      granularityTicks,
      updateInterval,
      activeNotes: [],
      renderAction: RenderActions.SONG,
    };
  } else if (action.type === Actions.SELECT_TRACK) {
    if (state.song !== null) {
      const { trackIndex } = action.payload;
      const { grid, granularity, updateInterval, granularityTicks } = createGrid(state.song, trackIndex, state.granularity);
      return {
        ...state,
        trackIndex,
        grid,
        granularity,
        granularityTicks,
        updateInterval,
        renderAction: RenderActions.SOLO_TRACK,
      };
    }
    return state;
  } else if (action.type === Actions.SEQUENCER_PLAY) {
    const renderAction = state.renderAction === RenderActions.PASS ? RenderActions.PAUSE : RenderActions.PLAY;
    return {
      ...state,
      renderAction,
    }
  } else if (action.type === Actions.SEQUENCER_STOP) {
    return {
      ...state,
      renderAction: RenderActions.STOP,
    }
  } else if (action.type === Actions.SELECT_INSTRUMENT) {
    return {
      ...state,
      renderAction: RenderActions.SET_INSTRUMENT,
    }
  } else if (action.type === Actions.SET_LOOP) {
    return {
      ...state,
      renderAction: RenderActions.SET_LOOP,
    }
  }
  return state;
};

export {
  song,
  songInitialState,
};