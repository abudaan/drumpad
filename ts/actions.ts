import { Dispatch, Action } from 'redux';
import { SongPosition, Config, ConfigData, IAction, SongInfo } from './interfaces';
import { ChangeEvent } from 'react';

export const LOADING = 'LOADING'; // generic load action
export const CONFIG_LOADED = 'CONFIG LOADED'; // config data loaded
export const SONG_READY = 'SONG READY'; // midi file and/or instrument loaded in song
export const SEQUENCER_PLAY = 'SEQUENCER PLAY';
export const SEQUENCER_STOP = 'SEQUENCER STOP';
export const CHOOSING_TEMPO = 'CHOOSING TEMPO'; // while dragging the thumb of the range input
export const UPDATE_TEMPO = 'UPDATE TEMPO'; // while releasing the thumb
export const UPDATE_POSITION = 'UPDATE POSITION';
export const ASSETPACK_LOADED = 'ASSETPACK LOADED';
export const INSTRUMENT_LOADED = 'INSTRUMENT LOADED';
export const SAMPLE_LOADED = 'SAMPLE LOADED';
export const MIDIFILE_LOADED = 'MIDIFILE LOADED';
export const SET_LOOP = 'SET LOOP';
export const SET_TRACK = 'SET TRACK';


const status = (response: Response) => {
  if (response.ok) {
    return response;
  }
  throw new Error(response.statusText);
  // if (response.status >= 200 && response.status < 300) {
  //     return Promise.resolve(response);
  // }
  // return Promise.reject(new Error(response.statusText));
};

const loadArrayBuffer = async (url: string) => fetch(url)
  .then(status)
  .then(response => response.arrayBuffer())
  .catch(e => console.error(e));

const loadJSON = async (url: string) => fetch(url)
  .then(status)
  .then(response => response.json())
  .catch(e => console.error(e));

const parseConfig = (config: Config) => {
  return new Promise(async (resolve) => {
    const data: ConfigData = {};
    if (config.assetPack) {
      data.assetPack = await loadJSON(config.assetPack);
    } else if (config.instrument) {
      data.instrument = await loadJSON(config.instrument);
    }
    if (config.midiFile) {
      data.midiFile = await loadArrayBuffer(config.midiFile);
    }
    resolve(data);
  })
};

/*
const loadConfig = async (url: string): Promise<any> => fetch(url)
  .then(status)
  .then(response => response.json())
  .then(data => parseConfig(data))
  .catch(e => console.error(e));

export const sequencerReady = (configUrl: string) => async (dispatch: Dispatch) => {
  const data = await loadConfig(configUrl);
  dispatch({
    type: CONFIG_LOADED,
    payload: {
      data,
    }
  });
};
*/

const load = async (url: string): Promise<any> => fetch(url)
  .then(status)
  .then(response => response.json())
  .then(data => parseConfig(data))
  .catch(e => console.error(e));

export const loadConfig = (configUrl: string) => async (dispatch: Dispatch) => {
  const data = await load(configUrl);
  // console.log(data);
  dispatch({
    type: CONFIG_LOADED,
    payload: {
      data,
    }
  });
};

export const songReady = (songInfo: SongInfo) => ({
  type: SONG_READY,
  payload: {
    ...songInfo,
  }
});

export const setTrack = (trackIndex: number) => ({
  type: SET_TRACK,
  payload: {
    trackIndex,
  }
});

export const loadInstrument = (url: string) => async (dispatch: Dispatch) => {
  dispatch({
    type: LOADING,
  });
  const instrument = await loadJSON(url);
  dispatch({
    type: INSTRUMENT_LOADED,
    payload: {
      instrument,
    }
  });
}

export const loadAssetPack = (url: string) => async (dispatch: Dispatch) => {
  dispatch({
    type: LOADING,
  });
  const assetPack = await loadJSON(url);
  dispatch({
    type: ASSETPACK_LOADED,
    payload: {
      assetPack,
    }
  });
}

export const loadMIDIFile = (url: string) => async (dispatch: Dispatch) => {
  dispatch({
    type: LOADING
  });
  const midiFile = await loadArrayBuffer(url);
  dispatch({
    type: MIDIFILE_LOADED,
    payload: {
      midiFile,
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


