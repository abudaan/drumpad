import { Dispatch, Action } from 'redux';
import { SongPosition, Config, ConfigData, HeartbeatSong } from './interfaces';
import sequencer from 'heartbeat-sequencer';

export const SEQUENCER_READY = 'sequencer ready'; // initialization of sequencer done
export const LOADING = 'loading'; // generic load action
export const CONFIG_LOADED = 'config loaded'; // config data loaded
export const SONG_LOADED = 'song loaded'; // midi file and/or instrument loaded in song
export const SEQUENCER_PLAY = 'sequencer play';
export const SEQUENCER_STOP = 'sequencer stop';
export const CHOOSING_TEMPO = 'choosing tempo'; // while dragging the thumb of the range input
export const UPDATE_TEMPO = 'update tempo'; // while releasing the thumb
export const UPDATE_POSITION = 'update position';
export const INSTRUMENT_LOADED = 'instrument loaded';
export const SAMPLE_LOADED = 'sample loaded';
export const MIDIFILE_LOADED = 'midifile loaded';
export const SET_LOOP = 'set loop';

const loadArrayBuffer = async (url: string) => fetch(url)
  .then(response => response.arrayBuffer())
  .catch(e => console.error(e));


const loadJSON = async (url: string) => fetch(url)
  .then(response => response.json())
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

const loadConfig = async (url: string): Promise<any> => fetch(url)
  .then(response => response.json())
  .then(data => parseConfig(data))
  .catch(e => console.error(e));


export const sequencerReady = (configUrl: string) => {
  return async (dispatch: Dispatch) => {
    const data = await loadConfig(configUrl);
    const instrument = data.instrument.instruments[0];
    let song = null;
    sequencer.addInstrument(instrument);
    // this.song = sequencer.createSong(this.props.midiFile, 'arraybuffer');
    sequencer.createMidiFile({ arraybuffer: data.midiFile })
      .then((json: Object) => {
        song = sequencer.createSong(json);
        song.tracks.forEach(track => track.setInstrument(sequencer.getInstrument(instrument.name)));

        dispatch({
          type: CONFIG_LOADED,
          payload: {
            song,
            instrument,
          }
        });
      }
      );
  }
};

export const loadInstrument = (url: string) => {  
  return async (dispatch: Dispatch) => {
    dispatch({
      type: LOADING
    });
    const instrument = await loadJSON(url);
    dispatch({
      type: INSTRUMENT_LOADED,
      payload: {
        instrument,
      }
    });
  }
}

export const loadMIDIFile = (url: string) => {
  return (dispatch: Dispatch) => dispatch(loadArrayBuffer(url));
}

export const loadSample = (url: string) => {
  return (dispatch: Dispatch) => dispatch(loadArrayBuffer(url));
}

export const play = () => {
  return {
    type: SEQUENCER_PLAY,
  };
};

export const stop = (): Action => {
  return {
    type: SEQUENCER_STOP,
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


