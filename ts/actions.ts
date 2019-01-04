import sequencer from 'heartbeat-sequencer';
import { Dispatch, Action } from 'redux';
import { SongPosition, Config, ConfigData, IAction, SongInfo } from './interfaces';
import { ChangeEvent } from 'react';

export const LOADING = 'LOADING'; // generic load action
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
export const SET_LOOP = 'SET LOOP';
export const SET_TRACK = 'SET TRACK';


const status = (response: Response) => {
  if (response.ok) {
    return response;
  }
  throw new Error(response.statusText);
};

// load binary midi file and create song from it
const loadArrayBuffer = async (url: string) => fetch(url)
  .then(status)
  .then(response => response.arrayBuffer())
  .then(ab => sequencer.createMidiFile({ arraybuffer: ab }))
  .then(json => { return sequencer.createSong(json) })
  .catch(e => console.error(e));

// generic json loader
const loadJSON = async (url: string) => fetch(url)
  .then(status)
  .then(response => response.json())
  .catch(e => console.error(e));

// parse config file and load all assets that are listed in the config file
const parseConfig = (config: Config) => {
  const songs = sequencer.getSongs();
  Object.keys(songs).forEach((k, v, s) => {
    sequencer.deleteSong(s);
  });

  return new Promise(async (resolve) => {
    const data: ConfigData = {};
    if (config.midiFile) {
      data.song = await loadArrayBuffer(config.midiFile);
    }
    if (config.assetPack) {
      data.assetPack = await loadJSON(config.assetPack);
    }
    if (data.assetPack) {
      sequencer.addAssetPack(data.assetPack, () => {
        if(data.assetPack.instruments[0]) {
          data.instrumentName = data.assetPack.instruments[0].name;
        }
        if(typeof config.midiFile === 'undefined') {
          try {
            data.song = sequencer.createSong(sequencer.getMidiFile(config.assetPack.midifiles[0].name));
          } catch(e) {
            data.song = null;
          }
        } else {
          resolve(data);
        }
      });
    } else {
      resolve(data);
    }
  })
};

export const loadConfig = (configUrl: string) => async (dispatch: Dispatch) => {
  const data: ConfigData = await loadJSON(configUrl).then(parseConfig);  
  const { song } = data;
  if (song) {
    song.update();
    song.setLeftLocator('barsbeats', 1, 1, 1, 0);
    song.setRightLocator('barsbeats', song.bars, 1, 1, 0);
    song.setLoop();  
    song.addEventListener('end', stop);
    song.addEventListener('position', 'beat', () => {
      const {
        bar,
        beat,
        barsAsString,
      } = song;
      updatePosition({
        bar,
        beat,
        barsAsString,
      });
    });
  }
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
export const updatePostion = (position: SongPosition): IAction<any> => ({
  type: UPDATE_POSITION,
  payload: {
    position,
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

