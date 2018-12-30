import sequencer from 'heartbeat-sequencer';
import React from 'react';
import { connect } from 'react-redux';
import { AppState, SongPosition, HeartbeatSong } from '../interfaces';
import {
  updatePosition, sequencerReady,
} from '../actions';
import { Dispatch } from 'redux';

interface Song {
  props: PropTypes,
  song: HeartbeatSong,
};

interface PropTypes {
  beats: number,
  sounds: number,
  tempo: number,
  samples: Array<any>,
  sequencerReady: () => void,
  updatePosition: (position:SongPosition) => void,
};

const mapStateToProps = (state: AppState) => {
  return {
    beats: state.song.beats,
    sounds: state.song.sounds,
    tempo: state.song.tempo,
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
        numNotes: 60
      });

      const part = sequencer.createPart();
      part.addEvents(events);

      this.song = sequencer.createSong({
        parts: part,
        useMetronome: true
      });
      
      this.props.sequencerReady();
    });
  }

  render() {
    return false;
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Song);



