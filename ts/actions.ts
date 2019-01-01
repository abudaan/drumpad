import { Dispatch, Action } from 'redux';
import { SongPosition, Config, ConfigData, IAction } from './interfaces';

export const SEQUENCER_READY = 'SEQUENCER READY'; // initialization of sequencer done
export const LOADING = 'LOADING'; // generic load action
export const CONFIG_LOADED = 'CONFIG LOADED'; // config data loaded
export const SONG_LOADED = 'SONG LOADED'; // midi file and/or instrument loaded in song
export const SEQUENCER_PLAY = 'SEQUENCER PLAY';
export const SEQUENCER_STOP = 'SEQUENCER STOP';
export const CHOOSING_TEMPO = 'CHOOSING TEMPO'; // while dragging the thumb of the range input
export const UPDATE_TEMPO = 'UPDATE TEMPO'; // while releasing the thumb
export const UPDATE_POSITION = 'UPDATE POSITION';
export const INSTRUMENT_LOADED = 'INSTRUMENT LOADED';
export const SAMPLE_LOADED = 'SAMPLE LOADED';
export const MIDIFILE_LOADED = 'MIDIFILE LOADED';
export const SET_LOOP = 'SET LOOP';

const loadArrayBuffer = async (url: string) => fetch(url)
  .then(response => response.arrayBuffer())
  .catch(e => console.error(e));

const loadJSON = async (url: string) => fetch(url)
  .then(response => response.json())
  .catch(e => console.error(e));

const loadConfig = async (url: string): Promise<any> => fetch(url)
  .then(response => response.json())
  .then(data => parseConfig(data))
  .catch(e => console.error(e));

const parseConfig = (config: Config) => {
  return new Promise(async (resolve) => {
    const data: ConfigData = {};
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

export const sequencerReady = (configUrl: string) => async (dispatch: Dispatch) => {
  const data = await loadConfig(configUrl);
  dispatch({
    type: CONFIG_LOADED,
    payload: {
      data,
    }
  });
};

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

export const loadMIDIFile = (url: string) => (dispatch: Dispatch) => dispatch(loadArrayBuffer(url));

export const loadSample = (url: string) => (dispatch: Dispatch) => dispatch(loadArrayBuffer(url));

export const play = () => ({
  type: SEQUENCER_PLAY,
});

export const stop = (): Action => ({
  type: SEQUENCER_STOP,
});

export const choosingTempo = (tempo: number): IAction<any> => ({
  type: CHOOSING_TEMPO,
  payload: {
    tempo,
  }
});

export const updateTempo = (tempo: number): IAction<any> => ({
  type: UPDATE_TEMPO,
  payload: {
    tempo,
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


