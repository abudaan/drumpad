import * as Actions from '../actions/actions';
import * as RenderActions from '../components/song';
import { SongState, IAction, Track, MIDIEvent, MIDIFileJSON, MIDIFileData, GridSelectedCells } from '../interfaces';
import { createGrid, addRow, getSelectedCells, cellIndexToMIDIIndex, updateNoteNumber } from '../utils/sequencer_utils';

const songInitialState = {
  grid: {
    numRows: 0,
    numCols: 0,
    selected: {},
  },
  os: 'unknown',
  ppq: 960,
  bpm: 120,
  nominator: 4,
  denominator: 4,
  timestamp: 0,
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
  activeColumn: 0,
  midiEvent: null,
  noteNumbers: [],
  instrumentSamplesList: [],
  instrumentNoteNumbers: [],
  unmuted: [],
};

const song = (state: SongState = songInitialState, action: IAction<any>) => {
  if (action.type === Actions.CONFIG_LOADED) {
    const {
      midiFiles,
      instrumentList,
      granularity,
      instrumentSamplesList,
    } = action.payload;
    const source = midiFiles[0] as MIDIFileData;
    const timeEvents = source.timeEvents;
    const midiEvents = source.tracks[0].events.filter((e: MIDIEvent) => e.type === 144);
    const { numRows, numCols, granularity: newGranularity, updateInterval, granularityTicks, allMIDIEvents, noteNumbers } = createGrid(source, midiEvents, granularity);
    const unmuted = midiEvents.map((e: MIDIEvent) => `${e.ticks}-${e.noteNumber}`);
    const activeMIDIEventIds = allMIDIEvents.filter(e => unmuted.indexOf(`${e.ticks}-${e.noteNumber}`) !== -1 && e.type === 144).map(e => e.id);
    const selected = getSelectedCells(midiEvents, granularityTicks, noteNumbers);
    return {
      ...state,
      instrumentSamplesList, 
      instrumentNoteNumbers: instrumentSamplesList.map((o: any) => parseInt(o[0], 10)),
      sequencerReady: true,
      ppq: source.ppq,
      bpm: source.bpm,
      nominator: source.nominator,
      denominator: source.denominator,
      song,
      grid: {
        numRows,
        numCols,
        selected,
      },
      unmuted,
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
      noteNumbers,
      renderAction: RenderActions.INIT,
    };
  } else if (action.type === Actions.SELECT_SONG) {
    const songIndex = action.payload.songIndex;
    const source = state.midiFiles[songIndex] as MIDIFileData;
    const timeEvents = source.timeEvents;
    const midiEvents = source.tracks[0].events.filter((e: MIDIEvent) => e.type === 144);
    const unmuted = midiEvents.map((e: MIDIEvent) => `${e.ticks}-${e.noteNumber}`);
    const { numCols, numRows, granularity: newGranularity, updateInterval, granularityTicks, allMIDIEvents, noteNumbers } = createGrid(source, midiEvents, state.granularity);
    const activeMIDIEventIds = allMIDIEvents.filter(e => unmuted.indexOf(`${e.ticks}-${e.noteNumber}`) !== -1 && e.type === 144).map(e => e.id);
    const selected = getSelectedCells(midiEvents, granularityTicks, noteNumbers);

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
      grid: {
        numRows,
        numCols,
        selected,
      },
      unmuted,
      granularity: newGranularity,
      granularityTicks,
      updateInterval,
      noteNumbers,
      renderAction: RenderActions.SONG,
    };
  } else if (action.type === Actions.SELECT_TRACK) {
    const { trackIndex } = action.payload;
    const source = state.midiFiles[state.songIndex];
    const midiEvents = source.tracks[trackIndex].events.filter((e: MIDIEvent) => e.type === 144);
    const unmuted = midiEvents.map((e: MIDIEvent) => `${e.ticks}-${e.noteNumber}`);
    const { numRows, numCols, granularity: newGranularity, updateInterval, granularityTicks, allMIDIEvents, noteNumbers } = createGrid(source, midiEvents, state.granularity);
    const activeMIDIEventIds = allMIDIEvents.filter(e => unmuted.indexOf(`${e.ticks}-${e.noteNumber}`) !== -1 && e.type === 144).map(e => e.id);
    const selected = getSelectedCells(midiEvents, granularityTicks, noteNumbers);

    return {
      ...state,
      trackIndex,
      grid: {
        numRows,
        numCols,
        selected,
      },
      unmuted,
      granularity: newGranularity,
      granularityTicks,
      updateInterval,
      allMIDIEvents,
      activeMIDIEventIds,
      noteNumbers,
      renderAction: RenderActions.TRACK,
    };
  } else if (action.type === Actions.UPDATE_EVENTS) {
    const data = action.payload.data as GridSelectedCells;
    const unmuted = Object.entries(data)
      .filter(([key, value]) => value === true)
      .map(([key, value]) => cellIndexToMIDIIndex(key, state.granularityTicks, state.noteNumbers));
    const activeMIDIEvents = state.allMIDIEvents.filter((e: MIDIEvent) => unmuted.indexOf(`${e.ticks}-${e.noteNumber}`) !== -1 && e.type === 144);
    const activeMIDIEventIds = activeMIDIEvents.map(e => e.id);
    const selected = getSelectedCells(activeMIDIEvents, state.granularityTicks, state.noteNumbers);

    return {
      ...state,
      grid: {
        ...state.grid,
        selected,
      },
      unmuted,
      activeMIDIEventIds,
      renderAction: RenderActions.UPDATE_EVENTS,
    };
  } else if (action.type === Actions.ADD_ROW) {
    const {
      midiEvents,
      noteNumbers,
    } = addRow(state.grid.numCols, state.noteNumbers, state.instrumentNoteNumbers, state.granularityTicks);
    return {
      ...state,
      grid: {
        ...state.grid,
        numRows: state.grid.numRows + 1,
      },
      allMIDIEvents: [
        ...state.allMIDIEvents,
        ...midiEvents,
      ],
      noteNumbers,
      renderAction: RenderActions.PASS,
    };
  } else if (action.type === Actions.PROCESS_MIDI_EVENT) {
    return {
      ...state,
      midiEvent: action.payload.midiEvent,
      renderAction: RenderActions.PROCESS_MIDI_EVENT,
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
      instrumentSamplesList: action.payload.instrumentSamplesList,
      instrumentNoteNumbers: action.payload.instrumentNoteNumbers,
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
  } else if (action.type === Actions.SELECT_NOTE_NUMBER) {
    const {
      oldNoteNumber,
      newNoteNumber,
    } = action.payload;
    const { allMIDIEvents, noteNumbers, unmuted } = updateNoteNumber(oldNoteNumber, newNoteNumber, state.allMIDIEvents, state.unmuted, state.noteNumbers);
    const activeMIDIEvents = allMIDIEvents.filter(e => unmuted.indexOf(`${e.ticks}-${e.noteNumber}`) !== -1 && e.type === 144);
    const activeMIDIEventIds = activeMIDIEvents.map(e => e.id);
    const selected = getSelectedCells(activeMIDIEvents, state.granularityTicks, noteNumbers);
    
    // console.log(activeMIDIEvents, selected)
    return {
      ...state,
      unmuted,
      grid: {
        ...state.grid,
        selected,
      },
      noteNumbers,
      allMIDIEvents,
      activeMIDIEventIds,
      renderAction: RenderActions.TRACK,
    }
  }
  return state;
};

export {
  song,
  songInitialState,
};