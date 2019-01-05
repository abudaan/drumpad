import sequencer from 'heartbeat-sequencer';
import { Dispatch, Action } from 'redux';
import { isNil } from 'ramda';
import { SongPosition, Config, ConfigData, IAction, SongInfo, HeartbeatSong, MIDIFileJSON, Instrument } from './interfaces';
import { ChangeEvent } from 'react';

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
export const SET_LOOP = 'SET LOOP';
export const SET_TRACK = 'SET TRACK';
export const SET_MIDIFILE = 'SET_MIDIFILE';
export const SET_INSTRUMENT = 'SET_INSTRUMENT';


const status = (response: Response) => {
  if (response.ok) {
    return response;
  }
  throw new Error(response.statusText);
};

// load binary MIDI file and create song from it (not in use)
const loadArrayBuffer = (url: string) => fetch(url)
  .then(status)
  .then(response => response.arrayBuffer())
  .then(ab => sequencer.createMidiFile({ arraybuffer: ab }))
  .then(json => { return sequencer.createSong(json) })
  .catch(e => console.error(e));

// generic json loader
const loadJSON = (url: string) => fetch(url)
  .then(status)
  .then(response => response.json())
  .catch(e => console.error(e));

// load binary MIDI file, add it to the assets and create a song from it
const createSongFromMIDIFile = (url: string): Promise<HeartbeatSong> => {
  return new Promise(resolve => {
    sequencer.addMidiFile({ url }, (json: MIDIFileJSON) => {
      if (isNil(json.name)) {
        json.name = url.substring(url.lastIndexOf('/') + 1);
      }
      resolve(sequencer.createSong(json) as HeartbeatSong);
    });
  });
}

// parse config file and load all assets that are listed in the config file
const parseConfig = (config: Config): Promise<ConfigData> => {
  deleteSongs();
  return new Promise(async (resolve) => {
    const data: ConfigData = {
      song: null,
      assetPack: null,
    };
    if (config.midiFile) {
      data.song = await createSongFromMIDIFile(config.midiFile);
    }
    if (config.assetPack) {
      data.assetPack = await loadJSON(config.assetPack);
    }
    if (data.assetPack) {
      sequencer.addAssetPack(data.assetPack, async () => {
        if (isNil(config.midiFile)) {
          if (data.assetPack !== null && !isNil(data.assetPack.midifiles[0])) {
            data.song = await createSongFromMIDIFile(config.midiFile);
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

const getLoadedMIDIFiles = () =>
  sequencer.getMidiFiles()
    .map((mf: MIDIFileJSON) => mf.name);

const getLoadedInstruments = () =>
  sequencer.getInstruments()
    .map((i: Instrument) => i.name)
    .filter((name: string) => name !== 'metronome');

// @TODO: dont delete songs!
const deleteSongs = () => {
  const songs = sequencer.getSongs();
  Object.values(songs).forEach((s) => {
    const song = s as HeartbeatSong;
    song.stop();
    // console.log('deleting song', song);
    song.removeEventListener('end');
    // sequencer.deleteSong(song);
  });
};

export const loadConfig = (configUrl: string) => async (dispatch: Dispatch) => {
  const data: ConfigData = await loadJSON(configUrl).then(parseConfig);
  // console.log(sequencer.getMidiFiles(), sequencer.getInstruments());
  // @TODO: create songs and add them to a list in the state
  if (data.song !== null) {
    data.song.addEventListener('end', () => {
      dispatch(stop());
    })
  }
  if (!isNil(data.song) || !isNil(data.assetPack)) {
    dispatch({
      type: CONFIG_LOADED,
      payload: {
        ...data,
        midiFileList: getLoadedMIDIFiles(),
        instrumentList: getLoadedInstruments(),
      }
    });
  }
};

export const loadAssetPack = (url: string) => async (dispatch: Dispatch) => {
  dispatch({
    type: LOADING,
  });
  const assetPack = await loadJSON(url);
  if (assetPack !== null) {
    sequencer.addAssetPack(assetPack, () => {
      dispatch({
        type: ASSETPACK_LOADED,
        payload: {
          assetPack,
          midiFileList: getLoadedMIDIFiles(),
          instrumentList: getLoadedInstruments(),
        }
      });
    });
  }
}

export const loadMIDIFile = (url: string) => async (dispatch: Dispatch) => {
  dispatch({
    type: LOADING
  });
  const song = await createSongFromMIDIFile(url);
  if (song !== null) {
    dispatch({
      type: MIDIFILE_LOADED,
      payload: {
        song,
        midiFileList: getLoadedMIDIFiles(),
        // @TODO: add the index so you can select this song in the dropdown in the UI
      }
    });
  }
}

export const setTrack = (trackIndex: number) => ({
  type: SET_TRACK,
  payload: {
    trackIndex,
  }
});

export const setInstrument = (instrumentIndex: number) => ({
  type: SET_INSTRUMENT,
  payload: {
    instrumentIndex,
  }
});

export const setMIDIFile = (midiFileIndex: number) => {
  deleteSongs();
  const mf: MIDIFileJSON = sequencer.getMidiFiles()[midiFileIndex];
  const song: HeartbeatSong = sequencer.createSong(mf);
  console.log(song);
  return {
    type: SET_MIDIFILE,
    payload: {
      midiFileIndex,
      song,
    }
  }
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

