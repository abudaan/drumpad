import { Dispatch, Action } from 'redux';
import { SongPosition, IAction, GridSelectedCells } from '../interfaces';
import { ChangeEvent, MouseEvent, SyntheticEvent } from 'react';
import {
  initSequencer,
  loadJSON,
  parseConfig,
  createMIDIFileList,
  addEndListener,
  getLoadedInstruments,
  addAssetPack,
  addMIDIFile,
  loadArrayBuffer,
  getInstrumentSamplesList,
} from '../utils/action_utils';

export const LOADING = 'LOADING'; // generic load action
export const LOAD_ERROR = 'LOAD_ERROR';
export const CONFIG_LOADED = 'CONFIG LOADED'; // config data loaded
export const SEQUENCER_PLAY = 'SEQUENCER PLAY';
export const SEQUENCER_STOP = 'SEQUENCER STOP';
export const CHOOSING_TEMPO = 'CHOOSING TEMPO'; // while dragging the thumb of the range input
export const UPDATE_TEMPO = 'UPDATE TEMPO'; // while releasing the thumb
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
export const PROCESS_MIDI_EVENT = 'PLAY_MIDIEVENT';
export const ADD_ROW = 'ADD_ROW';
export const SELECT_NOTE_NUMBER = 'SELECT_NOTE_NUMBER';

export const loadConfig = (configUrl: string) => async (dispatch: Dispatch) => {
  dispatch({
    type: LOADING,
  });
  await initSequencer();
  const config = await loadJSON(configUrl);
  const instrumentSamplesList = await parseConfig(config);
  const midiFiles = createMIDIFileList();

  dispatch({
    type: CONFIG_LOADED,
    payload: {
      ...config,
      midiFiles,
      instrumentList: getLoadedInstruments(),
      instrumentSamplesList,
    }
  });
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

export const selectInstrument = (instrumentIndex: number) => ({
  type: SELECT_INSTRUMENT,
  payload: {
    instrumentIndex,
    instrumentSamplesList: getInstrumentSamplesList(instrumentIndex),
  }
});

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

export const choosingTempo = (e: ChangeEvent<HTMLInputElement>): IAction<any> => ({
  type: CHOOSING_TEMPO,
  payload: {
    tempoTmp: parseInt(e.target.value, 10),
  }
});

export const updateTempo = (e: MouseEvent<HTMLInputElement>): IAction<any> => {
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

export const updateEvents = (data: GridSelectedCells): IAction<any> => ({
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

export const processMIDIEvent = (midiEvent: Array<number>): IAction<any> => ({
  type: PROCESS_MIDI_EVENT,
  payload: {
    midiEvent,
  }
});

export const addRow = (): IAction<any> => ({
  type: ADD_ROW,
});

export const selectNoteNumber = (newNoteNumber: number, oldNoteNumber: number): IAction<any> => ({
  type: SELECT_NOTE_NUMBER,
  payload: {
    newNoteNumber,
    oldNoteNumber,
  }
});