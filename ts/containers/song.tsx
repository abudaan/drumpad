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
};

type PropTypes = {
  configUrl: string,
  loading: boolean,
  tempo: number,
  playing: boolean,
  song: HeartbeatSong,
  stop: () => void,
  sequencerReady: (url: string) => void,
  updatePosition: (position: SongPosition) => void,
};

const mapStateToProps = (state: AppState) => {
  return {
    tempo: state.song.tempo,
    playing: state.song.playing,
    loading: state.data.loading,
    song: state.song.song,
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

    sequencer.ready(() => {
      this.props.sequencerReady(this.props.configUrl);
    });
  }

  render() {
    if (this.props.loading === true) {
      this.song = null;
      return false;
    }
    if (this.song === null) {
      this.song = this.props.song;
      return false;
    }

    if (this.props.playing === true && !this.song.playing) {
      this.song.play();
    } else if (this.props.playing === false && this.song.playing === true) {
      this.song.stop();
    } else if (this.props.tempo !== this.song.bpm) {
      this.song.setTempo(this.props.tempo);
    }
    return false;
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Song);



