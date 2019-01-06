import sequencer from 'heartbeat-sequencer';
import { MIDIFileJSON, Instrument, HeartbeatSong, AssetPack, Config } from '../interfaces';
import { isNil } from 'ramda';
import { Action } from 'redux';

const status = (response: Response) => {
  if (response.ok) {
    return response;
  }
  throw new Error(response.statusText);
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
  // stopAllSongs();
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


const createSongList = (): Array<HeartbeatSong> =>
  sequencer.getMidiFiles().map((mf: MIDIFileJSON) =>
    sequencer.createSong(mf));


const addEndListener = (songList: Array<HeartbeatSong>, action: () => void) => {
  songList.forEach(song => {
    if (isNil(song.listeners['end'])) {
      song.addEventListener('end', () => {
        action();
      })
    }
  });
}

export {
  parseConfig,
  loadJSON,
  loadArrayBuffer,
  addAssetPack,
  addMIDIFile,
  addEndListener,
  getLoadedInstruments,
  createSongList,
  stopAllSongs,
}