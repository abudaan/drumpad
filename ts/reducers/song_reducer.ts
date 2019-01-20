import { isNil } from 'ramda';
import * as Actions from '../actions/actions';
import * as RenderActions from '../components/song';
import { SongState, IAction, Track, MIDIEvent, MIDIFileJSON, MIDIFileData, MatricSelectedCells, MIDIFileDataTrack } from '../interfaces';
import { createMatrix, addRow, getSelectedCells, cellIdToTicksAndNoteNumber, updateNoteNumber, cellIdToMIDIEvent, noteNumberToMIDIEvent } from '../utils/song_reducer_utils';

const songInitialState = {
  matrix: {
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
  midiFilesData: [],
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
  midiInputs: {},
  midiOutputs: {},
  midiInputsList: [],
  midiOutputsList: [],
  connectedMIDIInputs: [],
  connectedMIDIOutputs: [],
};

const song = (state: SongState = songInitialState, action: IAction<any>) => {
  if (action.type === Actions.CONFIG_LOADED) {
    const {
      midiFilesData,
      instrumentList,
      granularity,
      instrumentSamplesList,
      midiInputs,
      midiOutputs,
    } = action.payload as Actions.LoadConfigPayload;
    const source = midiFilesData[0] as MIDIFileData;
    const timeEvents = source.timeEvents;
    const midiEvents = source.tracks[0].events.filter((e: MIDIEvent) => e.type === 144);
    const { numRows, numCols, granularity: newGranularity, updateInterval, granularityTicks, allMIDIEvents, noteNumbers } = createMatrix(source, midiEvents, granularity);
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
      matrix: {
        numRows,
        numCols,
        selected,
      },
      unmuted,
      midiFilesData,
      songIndex: 0,
      timeEvents,
      allMIDIEvents,
      activeMIDIEventIds: activeMIDIEventIds,
      granularity: newGranularity,
      granularityTicks,
      updateInterval,
      songList: midiFilesData.map((mfd: MIDIFileData) => mfd.name),
      trackList: midiFilesData[0].tracks.map((t: MIDIFileDataTrack) => t.name),
      instrumentList,
      noteNumbers,
      midiInputs,
      midiOutputs,
      midiInputsList: [['none', 'MIDI in'], ...Object.values(midiInputs).map(p => [p.id, p.name])],
      midiOutputsList: [['none', 'MIDI out'], ...Object.values(midiOutputs).map(p => [p.id, p.name])],
      connectedMIDIInputs: Object.values(midiInputs).map(p => [p.id, false]),
      connectedMIDIOutputs: Object.values(midiOutputs).map(p => [p.id, false]),
      renderAction: RenderActions.INIT,
    };
  } else if (action.type === Actions.SELECT_SONG) {
    const songIndex = action.payload.songIndex;
    const source = state.midiFilesData[songIndex];
    const timeEvents = source.timeEvents;
    const midiEvents = source.tracks[0].events.filter((e: MIDIEvent) => e.type === 144);
    const unmuted = midiEvents.map((e: MIDIEvent) => `${e.ticks}-${e.noteNumber}`);
    const { numCols, numRows, granularity: newGranularity, updateInterval, granularityTicks, allMIDIEvents, noteNumbers } = createMatrix(source, midiEvents, state.granularity);
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
      trackList: state.midiFilesData[songIndex].tracks.map((t: MIDIFileDataTrack) => t.name),
      trackIndex: 0,
      matrix: {
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
    const source = state.midiFilesData[state.songIndex];
    const midiEvents = source.tracks[trackIndex].events.filter((e: MIDIEvent) => e.type === 144);
    const unmuted = midiEvents.map((e: MIDIEvent) => `${e.ticks}-${e.noteNumber}`);
    const { numRows, numCols, granularity: newGranularity, updateInterval, granularityTicks, allMIDIEvents, noteNumbers } = createMatrix(source, midiEvents, state.granularity);
    const activeMIDIEventIds = allMIDIEvents.filter(e => unmuted.indexOf(`${e.ticks}-${e.noteNumber}`) !== -1 && e.type === 144).map(e => e.id);
    const selected = getSelectedCells(midiEvents, granularityTicks, noteNumbers);

    return {
      ...state,
      trackIndex,
      matrix: {
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
    const data = action.payload.data as MatricSelectedCells;
    const unmuted = Object.entries(data).filter(([key, value]) => value === true).map(([key, value]) => cellIdToTicksAndNoteNumber(key, state.granularityTicks, state.noteNumbers));
    const activeMIDIEvents = state.allMIDIEvents.filter((e: MIDIEvent) => unmuted.indexOf(`${e.ticks}-${e.noteNumber}`) !== -1 && e.type === 144);
    const activeMIDIEventIds = activeMIDIEvents.map(e => e.id);
    const selected = getSelectedCells(activeMIDIEvents, state.granularityTicks, state.noteNumbers);

    return {
      ...state,
      matrix: {
        ...state.matrix,
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
    } = addRow(state.matrix.numCols, state.noteNumbers, state.instrumentNoteNumbers, state.granularityTicks);
    return {
      ...state,
      matrix: {
        ...state.matrix,
        numRows: state.matrix.numRows + 1,
      },
      allMIDIEvents: [
        ...state.allMIDIEvents,
        ...midiEvents,
      ],
      noteNumbers,
      renderAction: RenderActions.PASS,
    };
  } else if (action.type === Actions.REMOVE_ROW) {
    const noteNumber = action.payload.noteNumber;
    const allMIDIEvents = [...state.allMIDIEvents.filter(e => e.noteNumber !== noteNumber)];
    const noteNumbers = [...state.noteNumbers.filter(n => n !== noteNumber)];
    const activeMIDIEvents = allMIDIEvents.filter((e: MIDIEvent) => state.activeMIDIEventIds.includes(e.id) && e.type === 144);
    const activeMIDIEventIds = activeMIDIEvents.map(e => e.id);
    const selected = getSelectedCells(activeMIDIEvents, state.granularityTicks, noteNumbers);
    const unmuted = state.unmuted.filter(id => parseInt(id.split('-')[1], 10) !== noteNumber);
    return {
      ...state,
      matrix: {
        ...state.matrix,
        numRows: state.matrix.numRows - 1,
        selected,
      },
      activeMIDIEventIds,
      allMIDIEvents,
      noteNumbers,
      unmuted,
      renderAction: RenderActions.UPDATE_EVENTS,
    }
  } else if (action.type === Actions.PLAY_SAMPLE) {
    const midiEvent = noteNumberToMIDIEvent(action.payload.noteNumber, action.payload.type);
    return {
      ...state,
      midiEvent,
      renderAction: RenderActions.PROCESS_MIDI_EVENT,
    };
  } else if (action.type === Actions.PLAY_SAMPLE_FROM_CELL) {
    const midiEvent = cellIdToMIDIEvent(action.payload.id, action.payload.type, state.noteNumbers);
    return {
      ...state,
      midiEvent,
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
      matrix: {
        ...state.matrix,
        selected,
      },
      noteNumbers,
      allMIDIEvents,
      activeMIDIEventIds,
      renderAction: RenderActions.TRACK,
    }
  } else if (action.type === Actions.SELECT_MIDI_IN_PORT) {
    const portId = action.payload.portId;
    const port = state.midiInputs[portId];
    const connectedMIDIInputs = state.connectedMIDIInputs.map(data => {
      if (portId === 'none') {
        return [data[0], false];
      }
      if (data[0] === portId) {
        return [portId, !isNil(port)]
      }
      return data;
    });
    return {
      ...state,
      connectedMIDIInputs,
      renderAction: RenderActions.SET_MIDI_IN,
    }
  } else if (action.type === Actions.SELECT_MIDI_OUT_PORT) {
    const portId = action.payload.portId;
    const port = state.midiOutputs[portId];
    const connectedMIDIOutputs = state.connectedMIDIOutputs.map(data => {
      if (portId === 'none') {
        return [data[0], false];
      }
      if (data[0] === portId) {
        return [portId, !isNil(port)]
      }
      return data;
    });
    return {
      ...state,
      connectedMIDIOutputs,
      renderAction: RenderActions.SET_MIDI_OUT,
    }
  } else if (action.type === Actions.UPDATE_MIDI_OUT_LATENCY) {
    return {
      ...state,
      renderAction: RenderActions.SET_MIDI_OUT_LATENCY,
    };
  } else {
    return state;
  }
}

export {
  song,
  songInitialState,
};