import { Dispatch, Action } from 'redux';
import { SongPosition, IAction } from '../interfaces';
import { ChangeEvent } from 'react';
import {
  loadJSON,
  parseConfig,
  createSongList,
  addEndListener,
  getLoadedInstruments,
  addAssetPack,
  addMIDIFile,
  loadArrayBuffer,
  createSong,
} from './action_utils';

export const LOADING = 'LOADING'; // generic load action
export const LOAD_ERROR = 'LOAD_ERROR';
export const CONFIG_LOADED = 'CONFIG LOADED'; // config data loaded
export const SEQUENCER_PLAY = 'SEQUENCER PLAY';
export const SEQUENCER_STOP = 'SEQUENCER STOP';
export const CHOOSING_TEMPO = 'CHOOSING TEMPO'; // while dragging the thumb of the range input
export const UPDATE_TEMPO = 'UPDATE TEMPO'; // while releasing the thumb
export const UPDATE_POSITION = 'UPDATE POSITION';
export const ASSETPACK_LOADED = 'ASSETPACK LOADED';
export const INSTRUMENT_LOADED = 'INSTRUMENT LOADED';
export const SAMPLE_LOADED = 'SAMPLE LOADED';
export const MIDIFILE_LOADED = 'MIDIFILE LOADED';
export const SET_LOOP = 'SET_LOOP';
export const SELECT_TRACK = 'SELECT_TRACK';
export const SELECT_SONG = 'SELECT_SONG';
export const SELECT_INSTRUMENT = 'SELECT_INSTRUMENT';

export const loadConfig = (configUrl: string) => async (dispatch: Dispatch) => {
  const config = await loadJSON(configUrl);
  const assetPack = await parseConfig(config);
  const songs = createSongList();
  const song = createSong(songs[0]);
  
  addEndListener(songs, () => { dispatch(stop()) });
  dispatch({
    type: CONFIG_LOADED,
    payload: {
      ...config,
      assetPack, // intentionally overwrites assetPack key in config!
      song,
      songs,
      instrumentList: getLoadedInstruments(),
    }
  });
};

export const loadAssetPack = (url: string) => async (dispatch: Dispatch) => {
  dispatch({
    type: LOADING,
  });
  const assetPack = await addAssetPack(url);
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
  const songs = createSongList();
  addEndListener(songs, () => { dispatch(stop()); });
  dispatch({
    type: MIDIFILE_LOADED,
    payload: {
      songs,
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

export const updateTempo = (e: { target: HTMLInputElement; }): IAction<any> => ({
  type: UPDATE_TEMPO,
  payload: {
    tempo: parseInt(e.target.value, 10),
  }

});
export const updatePostion = (position: SongPosition): IAction<any> => ({
  type: UPDATE_POSITION,
  payload: {
    ...position,
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