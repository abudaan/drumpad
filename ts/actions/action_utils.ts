import sequencer from 'heartbeat-sequencer';
import { MIDIFileJSON, Instrument, HeartbeatSong, AssetPack, Config } from '../interfaces';
import { isNil } from 'ramda';

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


const initSequencer = () => new Promise((resolve) => {
  sequencer.ready(resolve);
});

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


const addMIDIFile = (url: string): Promise<MIDIFileJSON> => new Promise((resolve) => {
  sequencer.addMidiFile({ url }, (json: MIDIFileJSON) => {
    resolve(json);
  });
});


const addAssetPack = (ap: AssetPack): Promise<AssetPack> => new Promise(async (resolve) => {
  sequencer.addAssetPack(ap, () => {    
    resolve(ap);
  });
})

// const addAssetPack = (url: string): Promise<AssetPack> => new Promise(async (resolve) => {
//   const ap = await loadJSON(url);
//   sequencer.addAssetPack(ap, () => {    
//     resolve(ap);
//   });
// })


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
const parseConfig = (config: Config): Promise<null> => {
  return new Promise(async (resolve) => {
    if (config.midiFile) {
      await addMIDIFile(config.midiFile);
    }
    if (config.assetPack) {
      const ap = await loadJSON(config.assetPack);
      await addAssetPack(ap);
      // await addAssetPack(config.assetPack);
    }
    resolve();
  });
}


const createSongList = (): Array<HeartbeatSong> => 
  sequencer.getMidiFiles().map((mf: MIDIFileJSON) =>
    sequencer.createSong(mf));



// const createSong = (song: HeartbeatSong): HeartbeatSong => sequencer.createSong({
//   ppq: song.ppq,
//   bpm: song.bpm,
//   nominator: song.nominator,
//   denominator: song.denominator,
//   timeEvents: song.timeEvents,
//   tracks: [sequencer.createTrack()],
// })

const createSong = (song: HeartbeatSong): HeartbeatSong => {
  const t = sequencer.createTrack();
  const p = sequencer.createPart();
  t.addPart(p);
  return sequencer.createSong({
    ppq: song.ppq,
    bpm: song.bpm,
    nominator: song.nominator,
    denominator: song.denominator,
    timeEvents: song.timeEvents,
    tracks: [t],
  })
}


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
  initSequencer,
  parseConfig,
  loadJSON,
  loadArrayBuffer,
  addAssetPack,
  addMIDIFile,
  addEndListener,
  getLoadedInstruments,
  createSongList,
  createSong,
  stopAllSongs,
}