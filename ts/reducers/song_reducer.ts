import * as Actions from '../actions/actions';
import { SongState, IAction, Track, HeartbeatSong, MIDIEvent } from '../interfaces';
import { createGrid } from './grid_utils';
import * as RenderActions from '../components/song';

const getMIDIEvents = (song: HeartbeatSong, trackIndex: number): Array<MIDIEvent> => {
  const track = song.tracks[trackIndex];
  const events = track.events.filter((e: MIDIEvent) => e.type === 144 || e.type === 128);
  const stripped = [];
  events.forEach(e => {
    e.song = null;
    e.track = null;
    e.part = null;
    stripped.push(e)
  })
  console.log(stripped);
  return stripped;
}

const songInitialState = {
  grid: null,
  song: null,
  songs: [],
  songList: [],
  songIndex: 0,
  trackList: [],
  instrumentList: [],
  instrumentName: null,
  granularity: 8,
  granularityTicks: 120,
  trackIndex: 0,
  updateInterval: 0, // in millis
  renderAction: RenderActions.PASS,
  midiEvents: [],
};

const song = (state: SongState = songInitialState, action: IAction<any>) => {
  if (action.type === Actions.CONFIG_LOADED) {
    const {
      song,
      songs,
      instrumentList,
      granularity,
    } = action.payload;
    const sourceSong = songs[0];
    const midiEvents = getMIDIEvents(sourceSong, 0);
    const { grid, granularity: newGranularity, updateInterval, granularityTicks } = createGrid(sourceSong, midiEvents, granularity);

    return {
      ...state,
      song,
      grid,
      songs,
      songIndex: 0,
      midiEvents,
      granularity: newGranularity,
      granularityTicks,
      updateInterval,
      songList: songs.map((s:HeartbeatSong) => s.name),
      trackList: songs[0].tracks.map((t: Track) => t.name),
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
    const songIndex = action.payload.songIndex;
    const song = state.song;
    if (song !== null) {
      const sourceSong = state.songs[songIndex];
      const {
        ppq,
        bpm,
        nominator,
        denominator,
      } = sourceSong;
      song.ppq = ppq;
      song.bpm = bpm;
      song.nominator = nominator;
      song.denominator = denominator;
      const midiEvents = getMIDIEvents(sourceSong, 0);
      const { grid, granularity, updateInterval, granularityTicks } = createGrid(sourceSong, midiEvents, state.granularity);
      return {
        ...state,
        song,
        songIndex,
        midiEvents,
        trackList: sourceSong.tracks.map((t: Track) => t.name),
        trackIndex: 0,
        grid,
        granularity,
        granularityTicks,
        updateInterval,
        activeNotes: [],
        renderAction: RenderActions.SONG,
      };
    }
    return {
      ...state,
      songIndex,
    }
  } else if (action.type === Actions.SELECT_TRACK) {
    if (state.song !== null) {
      const { trackIndex } = action.payload;
      const sourceSong = state.songs[state.songIndex];
      const midiEvents = getMIDIEvents(sourceSong, trackIndex);
      const { grid, granularity, updateInterval, granularityTicks } = createGrid(sourceSong, midiEvents, state.granularity);
      state.song.tracks[0].removeEvents(state.song.tracks[0].parts[0].events);

      return {
        ...state,
        trackIndex,
        midiEvents,
        grid,
        granularity,
        granularityTicks,
        updateInterval,
        renderAction: RenderActions.UPDATE_EVENTS,
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
      renderAction: RenderActions.SELECT_INSTRUMENT,
    }
  } else if (action.type === Actions.UPDATE_TEMPO) {
    return {
      ...state,
      renderAction: RenderActions.TEMPO,
    };
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