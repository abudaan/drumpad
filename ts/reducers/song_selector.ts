
// NOT IN USE, KEEP FOR REFERENCE!


import { createSelector } from 'reselect';
import sequencer from 'heartbeat-sequencer';
import { AppState, SongState, State, HeartbeatSong } from '../interfaces';

const getAppState = (state: State): AppState => state.app;
const getSongState = (state: State): SongState => state.song;


const parseConfig = (midiFile: ArrayBuffer, assetPack: Object) => {
  return sequencer.createMidiFile({ arraybuffer: midiFile })
    .then((json: Object) => {
      sequencer.addAssetPack(assetPack, () => {
        return json;
      });
    })
    .catch((e: Error) => {
      console.log(e);
    });
}

const createSong = (song: null | HeartbeatSong, json: Object, assetPack: Object, instrumentIndex: number) => {
  if (song !== null) {
    sequencer.deleteSong(song);
  }
  const tracks = [];
  const instrument = assetPack.instruments[instrumentIndex].name;
  json.tracks.forEach((track: any, index: number) => {
    track.setInstrument(sequencer.getInstrument(instrument));
    track.mute = index !== 0;
    tracks.push(track);
  });
  const song = sequencer.createSong({
    bpm: json.bpm,
    tracks: json.tracks,
  })
  song.update();
  song.setLeftLocator('barsbeats', 1, 1, 1, 0);
  song.setRightLocator('barsbeats', song.bars, 1, 1, 0);
  song.setLoop();
  const songInfo = {
    tracks,
    ppq: this.song.ppq,
    bars: this.song.bars,
    nominator: this.song.nominator,
    denominator: this.song.denominator,
  }
  return song;
}

/*
const loadMIDIFile = () => {
  sequencer.deleteSong(this.song);
  sequencer.createMidiFile({ arraybuffer: this.props.midiFile })
    .then((json: Object) => {
      this.createSong(json);
    });
}

const loadAssetPack = () => {
  sequencer.addAssetPack(this.props.assetPack, () => {
    const instrument = this.props.assetPack.instruments[this.props.instrumentIndex].name;
    this.song.tracks.forEach((track: any) => {
      track.setInstrument(sequencer.getInstrument(instrument));
    });
  });
}
*/

export default createSelector(
  // [getSongState, (state: SongState, props: SongPropTypes) => props, getDataState],
  // (songState: SongState, props: SongPropTypes, dataState: AppState) => {
  [getAppState, getSongState],
  (appState: AppState, songState: SongState) => {
    const {
      assetPack,
      midiFile,
    } = appState;

    let {
      song,
    } = songState;

    // if (assetPack && midiFile) {
    //   parseConfig(midiFile, assetPack)
    //     .then(json => createSong(json));
    // }

    return {
      song,
    };
  }
);
