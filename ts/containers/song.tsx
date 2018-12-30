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
  beats: number,
  sounds: number,
  tempo: number,
  samples: Array<any>,
  playing: boolean,
  stop: () => void,
  sequencerReady: () => void,
  updatePosition: (position:SongPosition) => void,
};

const mapStateToProps = (state: AppState) => {
  return {
    beats: state.song.beats,
    samples: state.samples,
    tempo: state.song.tempo,
    playing: state.song.playing,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    sequencerReady: () => {
      dispatch(sequencerReady());
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
      const events = sequencer.util.getRandomNotes({
        minNoteNumber: 60,
        maxNoteNumber: 100,
        minVelocity: 30,
        maxVelocity: 80,
        numNotes: 10
      });

      const part = sequencer.createPart();
      part.addEvents(events);

      this.song = sequencer.createSong({
        parts: part,
        useMetronome: true,
      });
      this.song.setLeftLocator('ticks', 0);
      this.song.setRightLocator('ticks', this.song.durationTicks);
      this.song.setLoop();      
      this.song.addEventListener('end', this.props.stop)
      this.props.sequencerReady();
    });
  }

  render() {
    if (typeof this.song === 'undefined') {
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



