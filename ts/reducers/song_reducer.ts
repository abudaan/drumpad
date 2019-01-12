import sequencer from 'heartbeat-sequencer';
import * as Actions from '../actions/actions';
import { SongState, IAction, Track, HeartbeatSong, MIDIEvent, GridCellData, MIDIFileJSON, MIDIFileData } from '../interfaces';
import { createGrid } from './grid_utils';
import * as RenderActions from '../components/song';

const songInitialState = {
  grid: {
    rows: 0,
    cols: 0,
    cells: [],
  },
  songs: [],
  songList: [],
  songIndex: 0,
  trackList: [],
  midiFiles: [],
  instrumentList: [],
  instrumentName: null,
  granularity: 8,
  granularityTicks: 120,
  trackIndex: 0,
  updateInterval: 0, // in millis
  renderAction: RenderActions.PASS,
  timeEvents: [],
  allMIDIEvents: [],
  activeMIDIEventIds: [],
  sequencerReady: false,
};

const song = (state: SongState = songInitialState, action: IAction<any>) => {
  if (action.type === Actions.CONFIG_LOADED) {
    const {
      midiFiles,
      instrumentList,
      granularity,
    } = action.payload;
    const source = midiFiles[0] as MIDIFileData;
    const timeEvents = source.timeEvents;
    const midiEvents = source.tracks[0].events.filter((e: MIDIEvent) => e.type === 144);
    const unmuted = midiEvents.map((e: MIDIEvent) => `${e.ticks}-${e.noteNumber}`);
    const { grid, granularity: newGranularity, updateInterval, granularityTicks, allMIDIEvents } = createGrid(source, midiEvents, granularity);
    const activeMIDIEventIds = allMIDIEvents.filter(e => unmuted.indexOf(`${e.ticks}-${e.noteNumber}`) !== -1 && e.type === 144).map(e => e.id);

    return {
      ...state,
      sequencerReady: true,
      ppq: source.ppq,
      bpm: source.bpm,
      nominator: source.nominator,
      denominator: source.denominator,
      song,
      grid,
      midiFiles,
      songIndex: 0,
      timeEvents,
      allMIDIEvents,
      activeMIDIEventIds: activeMIDIEventIds,
      granularity: newGranularity,
      granularityTicks,
      updateInterval,
      songList: midiFiles.map((mf: MIDIFileJSON) => mf.name),
      trackList: midiFiles[0].tracks.map((t: Track) => t.name),
      instrumentList,
      renderAction: RenderActions.INIT,
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
    const source = state.midiFiles[songIndex] as MIDIFileData;
    const timeEvents = source.timeEvents;
    const midiEvents = source.tracks[0].events.filter((e: MIDIEvent) => e.type === 144);
    const unmuted = midiEvents.map((e: MIDIEvent) => `${e.ticks}-${e.noteNumber}`);
    const { grid, granularity: newGranularity, updateInterval, granularityTicks, allMIDIEvents } = createGrid(source, midiEvents, state.granularity);
    const activeMIDIEventIds = allMIDIEvents.filter(e => unmuted.indexOf(`${e.ticks}-${e.noteNumber}`) !== -1 && e.type === 144).map(e => e.id);

    return {
      ...state,
      ppq: source.ppq,
      bpm: source.bpm,
      nominator: source.nominator,
      denominator: source.denominator,
      songIndex,
      timeEvents,
      allMIDIEvents,
      activeMIDIEventIds,
      trackList: state.midiFiles[songIndex].tracks.map((t: Track) => t.name),
      trackIndex: 0,
      grid,
      granularity: newGranularity,
      granularityTicks,
      updateInterval,
      renderAction: RenderActions.SONG,
    };
  } else if (action.type === Actions.SELECT_TRACK) {
    const { trackIndex } = action.payload;
    const source = state.midiFiles[state.songIndex];
    const midiEvents = source.tracks[trackIndex].events.filter((e: MIDIEvent) => e.type === 144);
    const unmuted = midiEvents.map((e: MIDIEvent) => `${e.ticks}-${e.noteNumber}`);
    const { grid, granularity: newGranularity, updateInterval, granularityTicks, allMIDIEvents } = createGrid(source, midiEvents, state.granularity);
    const activeMIDIEventIds = allMIDIEvents.filter(e => unmuted.indexOf(`${e.ticks}-${e.noteNumber}`) !== -1 && e.type === 144).map(e => e.id);
    return {
      ...state,
      trackIndex,
      grid,
      granularity: newGranularity,
      granularityTicks,
      updateInterval,
      allMIDIEvents,
      activeMIDIEventIds,
      renderAction: RenderActions.TRACK,
    };
  } else if (action.type === Actions.SEQUENCER_PLAY) {
    const renderAction = state.renderAction === RenderActions.PLAY ? RenderActions.PAUSE : RenderActions.PLAY;
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
  } else if (action.type === Actions.UPDATE_EVENTS) {
    const data = action.payload.data;
    const remove = data
      .filter((d: GridCellData) => (d.selected === false))
      .map((d: GridCellData) => d.midiEventId);

    const staleEvents: Array<MIDIEvent> = [];
    // const staleEvents: Array<string> = [];
    remove.forEach((id: string) => {
      const e: undefined | MIDIEvent = state.currentMidiEvents.find((e: MIDIEvent) => {
        return e.id === id;
      });
      if (typeof e !== 'undefined') {
        // staleEvents.push(e.id);
        // staleEvents.push(e.midiNote.noteOff.id);
        staleEvents.push(e);
        staleEvents.push(e.midiNote.noteOff);
      }
    })
    const add = data
      .filter((d: GridCellData) => (d.selected === true))
    const freshEvents: Array<MIDIEvent> = [];
    add.forEach((d: GridCellData) => {
      const {
        ticks,
        noteNumber,
      } = d;
      freshEvents.push(sequencer.createMidiEvent(ticks, 144, noteNumber, 100));
      freshEvents.push(sequencer.createMidiEvent(ticks + state.granularityTicks, 128, noteNumber, 0));
    });

    const filtered = state.currentMidiEvents
      // .filter((e: MIDIEvent) => staleEvents.indexOf(e.id) === -1);
      .filter((e: MIDIEvent) => {
        // console.log(e.id, staleEvents.map(e => e.id));
        const stale = staleEvents.find((s) => {
          return s.id === e.id
        });
        // console.log(stale);
        return typeof stale === 'undefined';
      });


    filtered.push(...freshEvents);
    // filtered.sort((a, b) => a.ticks - b.ticks).sort((a, b) => a.type - b.type);

    const sourceSong = state.songs[state.songIndex];

    return {
      ...state,
      staleMidiEvents: staleEvents,
      freshMidiEvents: freshEvents,
      currentMidiEvents: filtered,
      renderAction: RenderActions.UPDATE_EVENTS,
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