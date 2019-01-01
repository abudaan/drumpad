import sequencer from 'heartbeat-sequencer';
import React from 'react';
import { connect } from 'react-redux';
import { AppState, SongPosition, HeartbeatSong } from '../interfaces';
import {
  updatePosition,
  sequencerReady,
  songReady,
  stop,
} from '../actions';
import { Dispatch } from 'redux';

interface Song {
  props: PropTypes,
  song: null | HeartbeatSong,
  assetPack: null | Object,
  instrument: null | Object,
  midiFile: null | Object,
  instrumentName: null | string,
};

type PropTypes = {
  configUrl: string,
  loading: null | string,
  loop: boolean,
  track: number,
  tempo: number,
  playing: boolean,
  song: HeartbeatSong,
  midiFile: ArrayBuffer,
  instrument: Object,
  assetPack: Object,
  stop: () => void,
  sequencerReady: (url: string) => void,
  songReady: (tracks: Array<any>) => void,
  updatePosition: (position: SongPosition) => void,
};

const mapStateToProps = (state: AppState) => {
  return {
    tempo: state.song.tempo,
    loop: state.song.loop,
    playing: state.song.playing,
    track: state.data.track,
    loading: state.data.loading,
    assetPack: state.data.assetPack,
    instrument: state.data.instrument,
    midiFile: state.data.midiFile,
  };
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
  currentTrack: number;
  constructor(props: any) {
    super(props);

    this.song = null;
    this.midiFile = null;
    this.assetPack = null;
    this.instrument = null;
    this.currentTrack = 0;

    sequencer.ready(() => {
      this.props.sequencerReady(this.props.configUrl);
    });
  }

  createSong(json: Object) {
    const tracks = [];
    json.tracks.forEach((track: any, index: number) => {
      track.setInstrument(sequencer.getInstrument(this.instrumentName));
      track.mute = index !== 0;
      tracks.push({
        value: index,
        label: track.name,
      });
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

  render() {
    if (this.props.loading === 'config') {
      if (this.song !== null) {
        sequencer.deleteSong(this.song);
        this.song = null;
      }
      this.midiFile = null;
      this.instrument = null;

    } else if (this.props.loading === 'midifile') {
      this.midiFile = null;
      sequencer.deleteSong(this.song);
      this.song = null;

    } else if (this.props.loading === 'assetpack') {
      this.assetPack = null;

    } else if (this.midiFile === null && this.props.midiFile !== null && this.assetPack === null && this.props.assetPack !== null) {
      this.assetPack = this.props.assetPack;
      this.instrumentName = this.props.assetPack.instruments[0].name;
      // this.song = sequencer.createSong(this.props.midiFile, 'arraybuffer');
      sequencer.createMidiFile({ arraybuffer: this.props.midiFile })
        .then((json: Object) => {
          this.midiFile = json;
          sequencer.addAssetPack(this.props.assetPack, () => {
            this.createSong(json);
          });
        })
        .catch((e: Error) => {
          console.log(e);
        });

    } else if (this.midiFile === null && this.props.midiFile !== null) {
      this.midiFile = this.props.midiFile;
      this.instrumentName = this.props.assetPack.instruments[0].name;
      sequencer.createMidiFile({ arraybuffer: this.midiFile })
        .then(this.createSong);

    } else if (this.assetPack === null && this.props.assetPack !== null) {
      this.assetPack = this.props.assetPack;
      sequencer.addAssetPack(this.props.assetPack, () => {
        // dispatch song ready
      });

    } else if (this.song !== null) {
      if (this.props.playing === true && !this.song.playing) {
        this.song.play();
      } else if (this.props.playing === false && this.song.playing === true) {
        this.song.stop();
      } else if (this.props.tempo !== this.song.bpm) {
        this.song.setTempo(this.props.tempo);
      } else if (this.props.loop !== this.song.loop) {
        this.song.setLoop();
      } else if (this.props.track !== this.currentTrack) {
        this.currentTrack = this.props.track;
        this.song.tracks.forEach((track, index) => {
          track.mute = index !== this.currentTrack
        });
      }
    }

    return false;
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Song);



