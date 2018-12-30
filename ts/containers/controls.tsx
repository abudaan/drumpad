// import * as R from 'ramda';
import React, { ChangeEvent } from 'react';
import { connect } from 'react-redux';
import Slider from '../components/slider';
import { AppState } from '../interfaces';
import {
  updateBeats,
  updateSounds,
  updateTempo,
  updateLoop,
} from '../actions';
import { Dispatch } from 'redux';

interface Controls {
  props: PropTypes,
};

interface PropTypes {
  beats: number,
  minBeats: number,
  maxBeats: number,
  updateBeats: (event: ChangeEvent) => void
  sounds: number,
  minSounds: number,
  maxSounds: number,
  updateSounds: (event: ChangeEvent) => void
};

const mapStateToProps = (state: AppState) => {
  return {
    beats: state.song.beats,
    minBeats: state.song.minBeats,
    maxBeats: state.song.maxBeats,
    sounds: state.song.sounds,
    minSounds: state.song.minSounds,
    maxSounds: state.song.maxSounds,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    updateBeats: (e) => {
      dispatch(updateBeats(e.target.value));
    },
    updateSounds: (e) => {
      dispatch(updateSounds(e.target.value));
    },
  }
}

class Controls extends React.Component {
  static defaultProps = {
  }
  render() {
    return (<div id="controls">
      <Slider
        min={this.props.minBeats}
        max={this.props.maxBeats}
        label="beats"
        value={this.props.beats}
        onChange={this.props.updateBeats}
      />
      <Slider
        min={this.props.minSounds}
        max={this.props.maxSounds}
        label="sounds"
        value={this.props.sounds}
        onChange={this.props.updateSounds}
      />
    </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Controls);



