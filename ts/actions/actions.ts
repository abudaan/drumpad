import { Dispatch, Action } from 'redux';
import { SongPosition, IAction, MatricSelectedCells, MIDIPortsObject, Config, MIDIFileData, Instrument } from '../interfaces';
import {
  initSequencer,
  loadJSON,
  parseConfig,
  createMIDIFileList,
  getLoadedInstruments,
  addAssetPack,
  addMIDIFile,
  loadArrayBuffer,
} from '../utils/action_utils';

export const LOADING = 'LOADING'; // generic load action
export const LOAD_ERROR = 'LOAD_ERROR';
export const CONFIG_LOADED = 'CONFIG LOADED'; // config data loaded
export const SEQUENCER_PLAY = 'SEQUENCER PLAY';
export const SEQUENCER_STOP = 'SEQUENCER STOP';
export const CHOOSING_TEMPO = 'CHOOSING TEMPO'; // while dragging the thumb of the range input
export const UPDATE_TEMPO = 'UPDATE TEMPO'; // while releasing the thumb
export const CHOOSING_MIDI_OUT_LATENCY = 'CHOOSING_MIDI_OUT_LATENCY'; // while dragging the thumb of the range input
export const UPDATE_MIDI_OUT_LATENCY = 'UPDATE_MIDI_OUT_LATENCY'; // while releasing the thumb
export const UPDATE_POSITION = 'UPDATE POSITION';
export const UPDATE_EVENTS = 'UPDATE EVENTS';
export const ASSETPACK_LOADED = 'ASSETPACK LOADED';
export const INSTRUMENT_LOADED = 'INSTRUMENT LOADED';
export const SAMPLE_LOADED = 'SAMPLE LOADED';
export const MIDIFILE_LOADED = 'MIDIFILE LOADED';
export const SET_LOOP = 'SET_LOOP';
export const SELECT_TRACK = 'SELECT_TRACK';
export const SELECT_SONG = 'SELECT_SONG';
export const SELECT_INSTRUMENT = 'SELECT_INSTRUMENT';
export const PLAY_SAMPLE = 'PLAY_SAMPLE';
export const PLAY_SAMPLE_FROM_CELL = 'PLAY_SAMPLE_FROM_CELL';
export const ADD_ROW = 'ADD_ROW';
export const REMOVE_ROW = 'REMOVE_ROW';
export const SELECT_NOTE_NUMBER = 'SELECT_NOTE_NUMBER';
export const SELECT_MIDI_IN_PORT = 'SELECT_MIDI_IN_PORT';
export const SELECT_MIDI_OUT_PORT = 'SELECT_MIDI_OUT_PORT';
export const HANDLE_INCOMING_MIDI_MESSAGE = 'HANDLE_INCOMING_MIDI_MESSAGE';
export const HANDLE_FILE_UPLOAD = 'HANDLE_FILE_UPLOAD';


export interface LoadConfigPayload extends Config {
  midiFilesData: Array<MIDIFileData>
  loadedInstruments: Array<Instrument>
  instrumentList: [number, string]
  instrumentSamplesList: Array<[string, { [id: string]: string }]>
  midiInputs: MIDIPortsObject
  midiOutputs: MIDIPortsObject
}
export const loadConfig = (configUrl: string) => async (dispatch: Dispatch) => {
  dispatch({
    type: LOADING,
  });
  await initSequencer();
  const config = await loadJSON(configUrl);
  const {
    loadedInstruments,
    instrumentSamplesList,
    midiInputs,
    midiOutputs,
  } = await parseConfig(config);
  const midiFilesData = createMIDIFileList();

  const event = {
    type: CONFIG_LOADED,
    payload: {
      ...config,
      midiFilesData,
      loadedInstruments,
      instrumentList: getLoadedInstruments(),
      instrumentSamplesList,
      midiInputs,
      midiOutputs,
    } as LoadConfigPayload
  }
  dispatch(event);
};

export const loadAssetPack = (url: string) => async (dispatch: Dispatch) => {
  dispatch({
    type: LOADING,
  });
  const ap = await loadJSON(url);
  const assetPack = await addAssetPack(ap);
  dispatch({
    type: ASSETPACK_LOADED,
    payload: {
      assetPack,
      instrumentList: getLoadedInstruments(),
    }
  });
}

export const loadMIDIFile = (url: string) => async (dispatch: Dispatch) => {
  dispatch({
    type: LOADING
  });
  await addMIDIFile(url);
  const midiFiles = createMIDIFileList();
  dispatch({
    type: MIDIFILE_LOADED,
    payload: {
      midiFiles,
    }
  });
}

export const selectTrack = (trackIndex: number) => ({
  type: SELECT_TRACK,
  payload: {
    trackIndex,
  }
});

export const selectInstrument = (instrumentIndex: number) => {
  return {
    type: SELECT_INSTRUMENT,
    payload: {
      instrumentIndex,
    }
  }
}

export const selectSong = (songIndex: number) => (dispatch: Dispatch) => {
  dispatch({
    type: SELECT_SONG,
    payload: {
      songIndex,
    }
  });
}

export const loadSample = (url: string) => async (dispatch: Dispatch) => {
  dispatch({
    type: LOADING,
  });
  const sample = await loadArrayBuffer(url);
  dispatch({
    type: SAMPLE_LOADED,
    payload: {
      sample,
    }
  });
}

export const play = () => ({
  type: SEQUENCER_PLAY,
});

export const stop = (): Action => ({
  type: SEQUENCER_STOP,
});

export const choosingMIDIOutLatency = (e: React.ChangeEvent<HTMLInputElement>): IAction<any> => ({
  type: CHOOSING_MIDI_OUT_LATENCY,
  payload: {
    latencyTmp: parseInt(e.target.value, 10),
  }
});

export const updateMIDIOutLatency = (e: React.FormEvent<HTMLInputElement>): IAction<any> => {
  const t = e.target as HTMLInputElement;
  return {
    type: UPDATE_MIDI_OUT_LATENCY,
    payload: {
      latency: parseInt(t.value, 10),
    }
  }
};

export const choosingTempo = (e: React.ChangeEvent<HTMLInputElement>): IAction<any> => ({
  type: CHOOSING_TEMPO,
  payload: {
    tempoTmp: parseInt(e.target.value, 10),
  }
});

export const updateTempo = (e: React.FormEvent<HTMLInputElement>): IAction<any> => {
  const t = e.target as HTMLInputElement;
  return {
    type: UPDATE_TEMPO,
    payload: {
      tempo: parseInt(t.value, 10),
    }
  }
};

export const updatePostion = (position: SongPosition): IAction<any> => ({
  type: UPDATE_POSITION,
  payload: {
    ...position,
  }
});

export const updateEvents = (data: MatricSelectedCells): IAction<any> => ({
  type: UPDATE_EVENTS,
  payload: {
    data,
  }
});

export const setLoop = (loop: boolean): IAction<any> => ({
  type: SET_LOOP,
  payload: {
    loop,
  }
});

export const updatePosition = (position: SongPosition): IAction<any> => ({
  type: UPDATE_POSITION,
  payload: {
    position,
  }
});

export const playSample = (noteNumber: number, type: number): IAction<any> => ({
  type: PLAY_SAMPLE,
  payload: {
    noteNumber,
    type,
  }
});

export const playSampleFromCell = (id: string, type: number): IAction<any> => ({
  type: PLAY_SAMPLE_FROM_CELL,
  payload: {
    id,
    type,
  }
});

export const addRow = (): IAction<any> => ({
  type: ADD_ROW,
});

export const removeRow = (noteNumber: number): IAction<any> => ({
  type: REMOVE_ROW,
  payload: {
    noteNumber,
  }
});

export const selectNoteNumber = (newNoteNumber: number, oldNoteNumber: number) => async (dispatch: Dispatch) => {
  dispatch({
    type: SELECT_NOTE_NUMBER,
    payload: {
      newNoteNumber,
      oldNoteNumber,
    }
  });
  setTimeout(() => {
    dispatch(playSample(newNoteNumber, 144));
    // send NOTE_OFF for continuous sounds like organ and strings
    setTimeout(() => {
      dispatch(playSample(newNoteNumber, 128));
    }, 700);
  }, 0);
};

// using redux-multi
// export const selectNoteNumber = (newNoteNumber: number, oldNoteNumber: number) => {
//   return [
//     {
//       type: SELECT_NOTE_NUMBER,
//       payload: {
//         newNoteNumber,
//         oldNoteNumber,
//       }
//     },
//     playSample(newNoteNumber, 144),
//   ];
// };

export const selectMIDIInPort = (portId: string) => ({
  type: SELECT_MIDI_IN_PORT,
  payload: {
    portId,
  }
});


export const selectMIDIOutPort = (portId: string) => ({
  type: SELECT_MIDI_OUT_PORT,
  payload: {
    portId,
  }
});


export const handleIncomingMIDIMessage = (midiMessage: WebMidi.MIDIMessageEvent) => ({
  type: HANDLE_INCOMING_MIDI_MESSAGE,
  payload: {
    midiMessage,
  }
});

export const handleFileUpload = (e: React.ChangeEvent, fileType: string) => {
  const target = e.target as HTMLInputElement;
  const files = target.files as FileList;
  return {
    type: HANDLE_FILE_UPLOAD,
    payload: {
      files,
      fileType,
    }
  };
};