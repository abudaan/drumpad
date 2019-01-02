import sequencer from 'heartbeat-sequencer';
import React from 'react';
import { connect } from 'react-redux';
import { AppState, SongPosition, HeartbeatSong, SongState } from '../interfaces';
import {
  updatePosition,
  sequencerReady,
  songReady,
  stop,
} from '../actions';
import { Dispatch } from 'redux';
import getSongUpdate from '../reducers/song_selector'

interface Song {
  props: SongPropTypes,
};

export type SongPropTypes = {
  configUrl: string,
  songAction: string,
  loop: boolean,
  track: number,
  tempo: number,
  playing: boolean,
  stopped: boolean,
  song: HeartbeatSong,
  midiFile: null | ArrayBuffer,
  instrumentIndex: number,
  assetPack: null | Object,
  stop: () => void,
  songReady: (tracks: Array<any>) => void,
  sequencerReady: (url: string) => void,
  updatePosition: (position: SongPosition) => void,
};

const mapStateToProps = (state: AppState & SongState, ownProps: SongPropTypes) => {
  return { ...getSongUpdate(state, ownProps) }
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    sequencerReady: (url: string) => {
      dispatch(sequencerReady(url));
    },
    songReady: (tracks: Array<any>) => {
      dispatch(songReady(tracks));
    },
    updatePosition: (position: SongPosition) => {
      dispatch(updatePosition(position));
    },
    stop: () => {
      dispatch(stop());
    }
  }
}

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

  componentDidMount() {
    sequencer.ready(() => {
      this.props.sequencerReady(this.props.configUrl);
    });
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

    } else if (nextProps.playing === true && this.props.playing === false) {
      this.songAction = PLAY;

    } else if (nextProps.stopped === true && this.props.stopped === false) {
      this.songAction = STOP;

    } else if (nextProps.playing === false && this.props.playing === true) {
      this.songAction = PAUSE;

    } else if (nextProps.tempo !== this.props.tempo) {
      this.songAction = TEMPO;

    } else if (nextProps.track !== this.props.track) {
      this.songAction = SOLO_TRACK;

    } else if (nextProps.loop !== this.props.loop) {
      this.songAction = SET_LOOP;
    }
    return this.songAction !== PASS;
  }

  render() {
    console.log('<Song> render', this.songAction);
    if (this.song === null) {
      if (this.songAction === CREATE_SONG) {
        this.loadConfig();
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

  loadConfig() {
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
      tracks.push(track.name);
    });
    this.song = sequencer.createSong({
      bpm: json.bpm,
      tracks: json.tracks,
    })
    this.song.update();
    this.song.setLeftLocator('barsbeats', 1, 1, 1, 0);
    // this.song.setRightLocator('barsbeats', this.song.bars + 1, 1, 1, 0);
    this.song.setRightLocator('barsbeats', 2, 1, 1, 0);
    this.song.setLoop();
    this.song.addEventListener('end', this.props.stop);
    this.props.songReady(tracks);
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
      track.mute = index !== this.props.track
    });
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Song);

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


