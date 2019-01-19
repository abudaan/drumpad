// utils used by ./actions/actions.ts

import sequencer from 'heartbeat-sequencer';
import { MIDIFileJSON, Instrument, HeartbeatSong, AssetPack, Config, Track, MIDIEvent, MIDIFileData, MIDINote, InstrumentMapping } from '../interfaces';
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


// const initSequencer = () => new Promise((resolve) => {
//   sequencer.ready(resolve);
// });

const initSequencer = () => sequencer.ready();

const getLoadedMIDIFiles = () =>
  sequencer.getMidiFiles()
    .map((mf: MIDIFileJSON) => mf.name);


const getLoadedInstruments = () =>
  sequencer.getInstruments()
    .map((i: Instrument, index: number) => [index, i.name])
    .filter((t: [number, string]) => t[1] !== 'metronome');


const addMIDIFile = (url: string): Promise<MIDIFileJSON> => new Promise((resolve) => {
  sequencer.addMidiFile({ url }, (json: MIDIFileJSON) => {
    // console.log(url);
    resolve(json);
  });
});

const addAssetPack = (ap: AssetPack): Promise<void> => new Promise((resolve) => {
  sequencer.addAssetPack(ap, () => {
    resolve();
  });
})

const addAssetPacks = (aps: Array<AssetPack>): Promise<void> => new Promise((resolve) => {
  let max = aps.length;
  aps.forEach(ap => {
    sequencer.addAssetPack(ap,
      () => {
        max--;
        // console.log(max);
        if (max === 0) {
          resolve();
        }
      })
  })
})

// this version does not work on Android!
const addAssetPack2 = (url: string): Promise<AssetPack> => new Promise(async (resolve) => {
  const ap = await loadJSON(url);
  sequencer.addAssetPack(ap, () => {
    resolve(ap);
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
const parseConfig = async (config: Config): Promise<Array<any>> => {
  return new Promise(async (resolve) => {
    if (config.midiFiles) {
      // console.log(config.midiFiles.map(async url => addMIDIFile(url)));
      await Promise.all(config.midiFiles.map(url => addMIDIFile(url)));
    }
    if (config.assetPacks) {
      const aps: Array<AssetPack> = await Promise.all(config.assetPacks.map(url => loadJSON(url)));
      await addAssetPacks(aps);
      // await Promise.all(aps.map(ap => addAssetPack(ap)));
    }
    const instrument = sequencer.getInstruments()[0];
    // console.log(sequencer.getInstruments());
    resolve(Object.entries(instrument.mapping))
  });
}

const createMIDIFileList = (): Array<MIDIFileData> =>
  sequencer.getMidiFiles().map((mf: MIDIFileJSON) => {
    const result: MIDIFileData = {
      name: mf.url.substring(mf.url.lastIndexOf('/') + 1),
      tracks: [],
      timeEvents: [...mf.timeEvents],
      ppq: mf.ppq,
      bpm: mf.bpm,
      nominator: mf.nominator,
      denominator: mf.denominator,
    };

    mf.tracks.forEach((t: Track) => {
      const key = Object.keys(t.partsById)[0];
      const events = Object.values(t.partsById[key].eventsById);
      result.tracks.push({
        name: t.name,
        events,
      });
    })

    return result;
  });


const addEndListener = (songList: Array<HeartbeatSong>, action: () => void) => {
  songList.forEach(song => {
    if (isNil(song.listeners['end'])) {
      song.addEventListener('end', () => {
        action();
      })
    }
  });
}


const getInstrumentSamplesList = (index: number) => {
  const instrument: Instrument = sequencer.getInstruments()[index];
  let instrumentSamplesList: Array<[string, {[id: string]: string}]> = [];
  let instrumentNoteNumbers = [];
  // console.log(index, instrument.name);
  if (instrument.name === 'sinewave') {
    instrumentNoteNumbers = Array.from(new Array(127).keys());
    // console.log(instrumentNoteNumbers);
  } else {
    instrumentSamplesList = Object.entries(instrument.mapping);
    instrumentNoteNumbers = instrumentSamplesList.map((o: any) => parseInt(o[0], 10));
  }
  return {
    instrumentSamplesList,
    instrumentNoteNumbers,
  }
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
  createMIDIFileList,
  getInstrumentSamplesList
}