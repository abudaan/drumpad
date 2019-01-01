import sequencer from 'heartbeat-sequencer';
import React from 'react';
import { connect } from 'react-redux';
import { AppState, SongPosition, HeartbeatSong } from '../interfaces';
import {
  updatePosition,
  sequencerReady,
  stop,
} from '../actions';
import { Dispatch } from 'redux';

interface Song {
  props: PropTypes,
  song: null | HeartbeatSong,
  instrument: null | Object,
  midiFile: null | ArrayBuffer,
};

type PropTypes = {
  configUrl: string,
  loading: boolean,
  tempo: number,
  playing: boolean,
  song: HeartbeatSong,
  midiFile: ArrayBuffer,
  instrument: Object,
  stop: () => void,
  sequencerReady: (url: string) => void,
  updatePosition: (position: SongPosition) => void,
};

const mapStateToProps = (state: AppState) => {
  return {
    tempo: state.song.tempo,
    playing: state.song.playing,
    loading: state.data.loading,
    instrument: state.data.instrument,
    midiFile: state.data.midiFile,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    sequencerReady: (url: string) => {
      dispatch(sequencerReady(url));
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
  constructor(props: any) {
    super(props);

    this.instrument = null;
    this.midiFile = null;

    sequencer.ready(() => {
      this.props.sequencerReady(this.props.configUrl);
    });
  }

  render() {
    if (this.props.loading === true) {
      this.song = null;
      this.midiFile = null;
      this.instrument = null;
    } else if (this.song === null && this.props.midiFile !== null && this.props.instrument !== null) {
      // this.song = this.props.song;
      this.midiFile = this.props.midiFile;
      this.instrument = this.props.instrument.instruments[0];
      // this.song = sequencer.createSong(this.props.midiFile, 'arraybuffer');
      sequencer.createMidiFile({ arraybuffer: this.midiFile })
        .then((json: Object) => {
          sequencer.addInstrument(this.instrument);
          console.log(this.instrument);
          this.song = sequencer.createSong(json);
          this.song.tracks.forEach(track => track.setInstrument(sequencer.getInstrument(this.instrument.name)));
        });
    } else if (this.song !== null) {
      if (this.props.playing === true && !this.song.playing) {
        this.song.play();
      } else if (this.props.playing === false && this.song.playing === true) {
        this.song.stop();
      } else if (this.props.tempo !== this.song.bpm) {
        this.song.setTempo(this.props.tempo);
      }
    }

    return false;
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Song);



