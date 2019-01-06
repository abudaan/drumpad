import sequencer from 'heartbeat-sequencer';
import { Dispatch, Action } from 'redux';
import { isNil } from 'ramda';
import { SongPosition, Config, ConfigData, IAction, SongInfo, HeartbeatSong, MIDIFileJSON, Instrument, AssetPack } from './interfaces';
import { ChangeEvent } from 'react';
import { SSL_OP_SINGLE_DH_USE } from 'constants';
import { MsHyphenateLimitLinesProperty } from 'csstype';

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

const status = (response: Response) => {
  if (response.ok) {
    return response;
  }
  throw new Error(response.statusText);
};

const getLoadedMIDIFiles = () =>
  sequencer.getMidiFiles()
    .map((mf: MIDIFileJSON) => mf.name);

const getLoadedInstruments = () =>
  sequencer.getInstruments()
    .map((i: Instrument) => i.name)
    .filter((name: string) => name !== 'metronome');

const stopAllSongs = () => {
  const songs = sequencer.getSongs();
  Object.values(songs).forEach((s) => {
    const song = s as HeartbeatSong;
    song.stop();
    // song.removeEventListener('end');
    // sequencer.deleteSong(song);
  });
};

// generic json loader
const loadJSON = (url: string) => fetch(url)
  .then(status)
  .then(response => response.json())
  .catch(e => console.error(e));

// generic ab loader
const loadArrayBuffer = (url: string) => fetch(url)
  .then(status)
  .then(response => response.arrayBuffer())
  .catch(e => console.error(e));

const addMIDIFile = (url: string): Promise<MIDIFileJSON> => new Promise(resolve => {
  sequencer.addMidiFile({ url }, (json: MIDIFileJSON) => {
    resolve(json);
  });
});

const addAssetPack = (url: string): Promise<AssetPack> => new Promise(async (resolve) => {
  const ap = await loadJSON(url);
  sequencer.addAssetPack(ap, () => {
    resolve(ap as AssetPack);
  });
})

// load binary MIDI file, add it to the assets and create a song from it
const createSongFromMIDIFile = (url: string): Promise<HeartbeatSong> => {
  return new Promise(resolve => {
    sequencer.addMidiFile({ url }, (json: MIDIFileJSON) => {
      resolve(sequencer.createSong(json) as HeartbeatSong);
    });
  });
}

// load binary MIDI file and create song from it (MIDI file is not added to the assets)
const createSongFromMIDIFile2 = (url: string) => loadArrayBuffer(url)
  .then(ab => sequencer.createMidiFile({ arraybuffer: ab }))
  .then(json => { return sequencer.createSong(json) })
  .catch(e => console.error(e));

// parse config file and load all assets that are listed in the config file
const parseConfig = (config: Config): Promise<null | AssetPack> => {
  stopAllSongs();
  return new Promise(async (resolve) => {
    let assetPack = null;
    if (config.midiFile) {
      await addMIDIFile(config.midiFile);
    }
    if (config.assetPack) {
      assetPack = await addAssetPack(config.assetPack);
    }
    resolve(assetPack);
  });
}

const createSongList = (): Array<HeartbeatSong> => sequencer.getMidiFiles().map((mf: MIDIFileJSON) => sequencer.createSong(mf));

const addEndListener = (songList: Array<HeartbeatSong>, dispatch: Dispatch) => {
  songList.forEach(song => {
    if(isNil(song.listeners['end'])) {
      song.addEventListener('end', () => {
        dispatch(stop());
      })
    }
  });
}

export const loadConfig = (configUrl: string) => async (dispatch: Dispatch) => {
  const assetPack = await loadJSON(configUrl).then(parseConfig);
  const songList = createSongList();
  addEndListener(songList, dispatch);
  dispatch({
    type: CONFIG_LOADED,
    payload: {
      songList,
      assetPack,
      instrumentList: getLoadedInstruments(),
    }
  });
};

export const loadAssetPack = (url: string) => async (dispatch: Dispatch) => {
  dispatch({
    type: LOADING,
  });
  const assetPack = await addAssetPack(url);
  sequencer.addAssetPack(assetPack, () => {
    dispatch({
      type: ASSETPACK_LOADED,
      payload: {
        assetPack,
        instrumentList: getLoadedInstruments(),
      }
    });
  });
}

export const loadMIDIFile = (url: string) => async (dispatch: Dispatch) => {
  dispatch({
    type: LOADING
  });
  await addMIDIFile(url);
  const songList = createSongList();
  addEndListener(songList, dispatch);
  dispatch({
    type: MIDIFILE_LOADED,
    payload: {
      songList,
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

export const selectSong = (songIndex: number) => {
  stopAllSongs();
  return {
    type: SELECT_SONG,
    payload: {
      songIndex,
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

