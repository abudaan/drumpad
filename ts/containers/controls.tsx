// import * as R from 'ramda';
import React, { ChangeEvent } from 'react';
import { connect } from 'react-redux';
import Slider from '../components/slider';
import { AppState } from '../interfaces';
import {
  updateBeats,
  updateSounds,
  updateTempo,
  setTempo,
  setLoop,
  play,
  stop,
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
  tempoTmp: number,
  minTempo: number,
  maxTempo: number,
  updateTempo: (event: ChangeEvent) => void,
  setTempo: (event: ChangeEvent) => void,
  play: (event: MouseEvent) => void,
  stop: (event: MouseEvent) => void,
  playing: boolean,
};

const mapStateToProps = (state: AppState) => {
  return {
    disabled: !state.song.sequencerReady,
    playing: state.song.playing,
    beats: state.song.beats,
    minBeats: state.song.minBeats,
    maxBeats: state.song.maxBeats,
    sounds: state.song.sounds,
    minSounds: state.song.minSounds,
    maxSounds: state.song.maxSounds,
    tempo: state.song.tempo,
    tempoTmp: state.song.tempoTmp,
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
    setTempo: (e) => {
      dispatch(setTempo(e.target.value));
    },
    play: () => {
      dispatch(play());
    },
    stop: () => {
      dispatch(stop());
    },
  }
}

class Controls extends React.Component {
  static defaultProps = {
  }
  render() {
    const label = this.props.playing ? 'pause' : 'play'
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
        value={this.props.tempoTmp}
        onMouseUp={this.props.setTempo}
        onChange={this.props.updateTempo}
        disabled={this.props.disabled}
      />
      <button
        type="button"
        onClick={this.props.play}
      >{label}</button>
      <button
        type="button"
        onClick={this.props.stop}
      >stop</button>
    </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Controls);



