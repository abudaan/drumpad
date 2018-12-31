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
  song: HeartbeatSong,
};

type PropTypes = {
  tempo: number,
  playing: boolean,
  configUrl: string,
  instrument: object,
  midiFile: ArrayBuffer,
  stop: () => void,
  sequencerReady: (url:string) => void,
  updatePosition: (position:SongPosition) => void,
};

const createSong = (midiFile) => {
//   sequencer.createMidiFile({blob: request.response}).then(
//     function onFulfilled(midifile){
//         createSong(midifile, 'blob');
//     },
//     function onRejected(e){
//         divMessage.textContent = 'error: ' + e;
//     }
// );
  return sequencer.createSong({
    useMetronome: true,
  });
}

const mapStateToProps = (state: AppState) => {
  return {
    beats: state.song.beats,
    samples: state.samples,
    tempo: state.song.tempo,
    playing: state.song.playing,
    instrument: state.song.instrument,
    midiFile: state.song.midiFile,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    sequencerReady: (url:string) => {
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

      // this.song = createSong()
      // this.song.setLeftLocator('ticks', 0);
      // this.song.setRightLocator('ticks', this.song.durationTicks);
      // this.song.setLoop();      
      // this.song.addEventListener('end', this.props.stop)
      this.props.sequencerReady(this.props.configUrl);
    });
  }

  render() {
    if (typeof this.song === 'undefined') {
      sequencer.addInstrument(this.props.instrument);
      sequencer.createMidiFile({arraybuffer: this.props.midiFile})
      .then(data => {
        console.log(data);
        // this.song = sequencer.createSong(this.props.midiFile, 'arraybuffer');
        this.song = sequencer.createSong(data);
      });
      return false;
    }
    
    if (this.props.playing === true && !this.song.playing) {
      this.song.play();
    } else if  (this.props.playing === false && this.song.playing === true) {
      this.song.stop();
    } else if (this.props.tempo !== this.song.bpm) {
      this.song.setTempo(this.props.tempo);
    }
    return false;
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Song);



