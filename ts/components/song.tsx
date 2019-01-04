import sequencer from 'heartbeat-sequencer';
import React from 'react';
import { SongPosition, HeartbeatSong, SongState, SongInfo } from '../interfaces';

interface Song {
  props: SongPropTypes,
};

export type SongPropTypes = {
  loop: boolean,
  tempo: number,
  playing: boolean,
  stopped: boolean,
  midiFile: null | ArrayBuffer,
  assetPack: null | Object,
  trackIndex: number,
  instrumentIndex: number,
  stop: () => void,
  songReady: (info: SongInfo) => void,
  updatePosition: (position: SongPosition) => void,
};

class Song extends React.Component {
  song: null | HeartbeatSong
  songAction: string;
  instrumentName: string;

  constructor(props: any) {
    super(props);

    this.song = null;
    this.songAction = PASS;
    this.instrumentName = '';
  }

  shouldComponentUpdate(nextProps: SongPropTypes, nextState: SongState) {
    this.songAction = PASS;
    if (
      nextProps.assetPack !== null && nextProps.midiFile !== null &&
      this.props.assetPack === null && this.props.midiFile === null
    ) {
      this.songAction = CREATE_SONG;

    } else if (nextProps.assetPack !== null && nextProps.assetPack !== this.props.assetPack) {
      this.songAction = LOAD_ASSETPACK;

    } else if (nextProps.midiFile !== null && this.props.midiFile !== nextProps.midiFile) {
      this.songAction = LOAD_MIDIFILE;

    } else if (nextProps.stopped === true && this.props.stopped === false) {
      this.songAction = STOP;

    } else if (nextProps.playing === true && this.props.playing === false) {
      this.songAction = PLAY;

    } else if (nextProps.playing === false && this.props.playing === true) {
      this.songAction = PAUSE;

    } else if (nextProps.tempo !== this.props.tempo) {
      this.songAction = TEMPO;

    } else if (nextProps.trackIndex !== this.props.trackIndex) {
      this.songAction = SOLO_TRACK;

    } else if (nextProps.loop !== this.props.loop) {
      this.songAction = SET_LOOP;
    }
    return this.songAction !== PASS;
  }

  render() {
    console.log('<Song> render', this.songAction, this.props);
    if (this.song === null) {
      if (this.songAction === CREATE_SONG) {
        this.parseConfig();
      }
    } else {
      switch (this.songAction) {
        case PLAY:
          this.song.play();
          break;

        case PAUSE:
          this.song.pause();
          break;

        case STOP:
          this.song.stop();
          break;

        case TEMPO:
          this.song.setTempo(this.props.tempo);
          break;

        case SOLO_TRACK:
          this.soloTrack();
          break;

        case SET_LOOP:
          this.song.setLoop();
          break;

        case LOAD_MIDIFILE:
          this.loadMIDIFile();
          break;

        case LOAD_ASSETPACK:
          this.loadAssetPack();
          break;
      }
    }
    return false;
  }

  parseConfig() {
    sequencer.createMidiFile({ arraybuffer: this.props.midiFile })
      .then((json: Object) => {
        sequencer.addAssetPack(this.props.assetPack, () => {
          this.createSong(json);
        });
      })
      .catch((e: Error) => {
        console.log(e);
      });
  }

  createSong(json: Object) {
    if (this.song !== null) {
      sequencer.deleteSong(this.song);
    }
    const tracks = [];
    const instrument = this.props.assetPack.instruments[this.props.instrumentIndex].name;
    json.tracks.forEach((track: any, index: number) => {
      track.setInstrument(sequencer.getInstrument(instrument));
      track.mute = index !== 0;
      tracks.push(track);
    });
    this.song = sequencer.createSong({
      bpm: json.bpm,
      tracks: json.tracks,
    })
    this.song.update();
    this.song.setLeftLocator('barsbeats', 1, 1, 1, 0);
    this.song.setRightLocator('barsbeats', this.song.bars, 1, 1, 0);
    this.song.setLoop();
    this.song.addEventListener('end', this.props.stop);
    const songInfo = {
      tracks,
      ppq: this.song.ppq,
      bars: this.song.bars,
      nominator: this.song.nominator,
      denominator: this.song.denominator,
    }
    this.props.songReady(songInfo);
  }

  loadMIDIFile() {
    sequencer.deleteSong(this.song);
    sequencer.createMidiFile({ arraybuffer: this.props.midiFile })
      .then((json: Object) => {
        this.createSong(json);
      });
  }

  loadAssetPack() {
    sequencer.addAssetPack(this.props.assetPack, () => {
      const instrument = this.props.assetPack.instruments[this.props.instrumentIndex].name;
      this.song.tracks.forEach((track: any) => {
        track.setInstrument(sequencer.getInstrument(instrument));
      });
    });
  }

  soloTrack() {
    this.song.tracks.forEach((track, index) => {
      track.mute = index !== this.props.trackIndex;
    });
  }
}

export default Song;

export const PASS = 'PASS';
export const CREATE_SONG = 'CREATE_SONG';
export const PLAY = 'PLAY';
export const PAUSE = 'PAUSE';
export const STOP = 'STOP';
export const TEMPO = 'TEMPO';
export const SET_LOOP = 'SET_LOOP';
export const SOLO_TRACK = 'SOLO_TRACK';
export const LOAD_ASSETPACK = 'LOAD_ASSETPACK';
export const LOAD_MIDIFILE = 'LOAD_MIDIFILE';


