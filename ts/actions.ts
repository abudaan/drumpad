import { Dispatch } from 'redux';
import { SongPosition, Config, ConfigData } from './interfaces';

export const SEQUENCER_READY = 'sequencer ready'; // initialization of sequencer done
export const LOADING = 'loading'; // loading config data
export const DATA_LOADED = 'data loaded'; // config data loaded
export const SONG_LOADED = 'song loaded'; // midi file and instrument loaded in song
export const SEQUENCER_PLAY = 'sequencer play';
export const SEQUENCER_STOP = 'sequencer stop';
export const UPDATE_BEATS = 'update beats';
export const UPDATE_SAMPLES = 'update samples';
export const CHOOSING_TEMPO = 'choosing tempo'; // while dragging the thumb of the range input
export const UPDATE_TEMPO = 'update tempo'; // while releasing the thumb
export const UPDATE_POSITION = 'update position';
export const SET_LOOP = 'set loop';

const loadArrayBuffer = async (url: string) => {
  return fetch(url)
    .then(response => response.arrayBuffer())
    .catch(e => console.error(e));
};

const loadJSON = async (url: string) => {
  return fetch(url)
    .then(response => response.json())
    .catch(e => console.error(e));
};

const parseConfig = (config:Config) => {
  return new Promise(async (resolve) => {
    const data:ConfigData = {};
    if (config.assetPack) {
      data.assetPack = await loadJSON(config.assetPack);
    } else {
      if (config.instrument) {
        data.instrument = await loadJSON(config.instrument);
      }
      if (config.midiFile) {
        data.midiFile = await loadArrayBuffer(config.midiFile);
      }
    } 
    resolve(data);
  })
};

export const loadData = (url: string) => {
  return (dispatch: Dispatch) => {
    fetch(url)
      .then(response => response.json())
      .then(data => parseConfig(data))
      .then(data => {
        dispatch({
          type: DATA_LOADED,
          payload: {
            data,
          }
        })
      })
      .catch(e => console.error(e));
  };
};

export const sequencerReady = (configUrl:string) => {
  return (dispatch: Dispatch) => dispatch(loadData(configUrl));
  // return {
  //   type: SEQUENCER_READY,
  // };
};

export const play = () => {
  return {
    type: SEQUENCER_PLAY,
  };
};

export const stop = () => {
  return {
    type: SEQUENCER_STOP,
  };
};

export const updateBeats = (beats: number) => {
  return {
    type: UPDATE_BEATS,
    payload: {
      beats,
    }
  };
};

export const updateSamples = (samples: number) => {
  return {
    type: UPDATE_SAMPLES,
    payload: {
      samples,
    }
  };
};

export const choosingTempo = (tempo: number) => {
  return {
    type: CHOOSING_TEMPO,
    payload: {
      tempo,
    }
  };
};

export const updateTempo = (tempo: number) => {
  return {
    type: UPDATE_TEMPO,
    payload: {
      tempo,
    }
  };
};

export const setLoop = (loop: boolean) => {
  return {
    type: SET_LOOP,
    payload: {
      loop,
    }
  };
};

export const updatePosition = (position: SongPosition) => {
  return {
    type: UPDATE_POSITION,
    payload: {
      position,
    }
  };
};


