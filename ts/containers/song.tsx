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
  assetPack: null | Object,
  instrument: null | Object,
  midiFile: null | ArrayBuffer,
};

type PropTypes = {
  configUrl: string,
  loading: boolean,
  loop: boolean,
  tempo: number,
  playing: boolean,
  song: HeartbeatSong,
  midiFile: ArrayBuffer,
  instrument: Object,
  assetPack: Object,
  stop: () => void,
  sequencerReady: (url: string) => void,
  updatePosition: (position: SongPosition) => void,
};

const mapStateToProps = (state: AppState) => {
  return {
    tempo: state.song.tempo,
    loop: state.song.loop,
    playing: state.song.playing,
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

    this.midiFile = null;
    this.assetPack = null;
    this.instrument = null;

    sequencer.ready(() => {
      this.props.sequencerReady(this.props.configUrl);
    });
  }

  render() {
    if (this.props.loading === true) {
      if (this.song !== null) {
        sequencer.deleteSong(this.song);
        this.song = null;
      }
      this.midiFile = null;
      this.instrument = null;
    } else if (this.song === null && this.props.midiFile !== null && this.props.assetPack !== null) {
      this.midiFile = this.props.midiFile;
      const name = this.props.assetPack.instruments[0].name;
      // this.song = sequencer.createSong(this.props.midiFile, 'arraybuffer');
      sequencer.createMidiFile({ arraybuffer: this.midiFile })
        .then((json: Object) => {
          sequencer.addAssetPack(this.props.assetPack, () => {
            this.song = sequencer.createSong(json);
            this.song.tracks.forEach(track => {
              track.setInstrument(sequencer.getInstrument(name));
              // console.log(track);
            });
            this.song.update();
            this.song.setLeftLocator('barsbeats', 1, 1, 1, 0);
            this.song.setRightLocator('barsbeats', this.song.bars + 1, 1, 1, 0);
            this.song.setLoop();
            this.song.addEventListener('end', this.props.stop);
          });
        })
        .catch((e: Error) => {
          console.log(e);
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
      }
    }

    return false;
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Song);



