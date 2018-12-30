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
  disabled: boolean,
  beats: number,
  minBeats: number,
  maxBeats: number,
  updateBeats: (event: ChangeEvent) => void
  sounds: number,
  minSounds: number,
  maxSounds: number,
  updateSounds: (event: ChangeEvent) => void
  tempo: number,
  minTempo: number,
  maxTempo: number,
  updateTempo: (event: ChangeEvent) => void
};

const mapStateToProps = (state: AppState) => {
  return {
    disabled: !state.song.sequencerReady,
    beats: state.song.beats,
    minBeats: state.song.minBeats,
    maxBeats: state.song.maxBeats,
    sounds: state.song.sounds,
    minSounds: state.song.minSounds,
    maxSounds: state.song.maxSounds,
    tempo: state.song.tempo,
    minTempo: state.song.minTempo,
    maxTempo: state.song.maxTempo,
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
    updateTempo: (e) => {
      dispatch(updateTempo(e.target.value));
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
        disabled={this.props.disabled}
        />
      <Slider
        min={this.props.minSounds}
        max={this.props.maxSounds}
        label="sounds"
        value={this.props.sounds}
        onChange={this.props.updateSounds}
        disabled={this.props.disabled}
        />
      <Slider
        min={this.props.minTempo}
        max={this.props.maxTempo}
        label="tempo"
        value={this.props.tempo}
        onChange={this.props.updateTempo}
        disabled={this.props.disabled}
      />
    </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Controls);



