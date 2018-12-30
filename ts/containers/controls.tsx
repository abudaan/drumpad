// import * as R from 'ramda';
import React, { ChangeEvent } from 'react';
import { connect } from 'react-redux';
import Slider from '../components/slider';
import { AppState } from '../interfaces';
import {
  updateBeats,
  updateSamples,
  choosingTempo,
  updateTempo,
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
  numSamples: number,
  minSamples: number,
  maxSamples: number,
  updateSounds: (event: ChangeEvent) => void
  tempo: number,
  tempoTmp: number,
  minTempo: number,
  maxTempo: number,
  choosingTempo: (event: ChangeEvent) => void,
  updateTempo: (event: ChangeEvent) => void,
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
    numSamples: state.samples.numSamples,
    minSamples: state.samples.minSamples,
    maxSamples: state.samples.maxSamples,
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
      dispatch(updateSamples(e.target.value));
    },
    choosingTempo: (e) => {
      dispatch(choosingTempo(e.target.value));
    },
    updateTempo: (e) => {
      dispatch(updateTempo(e.target.value));
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
        min={this.props.minSamples}
        max={this.props.maxSamples}
        label="samples"
        value={this.props.numSamples}
        onChange={this.props.updateSounds}
        disabled={this.props.disabled}
        />
      <Slider
        min={this.props.minTempo}
        max={this.props.maxTempo}
        label="tempo"
        value={this.props.tempoTmp}
        onMouseUp={this.props.updateTempo}
        onChange={this.props.choosingTempo}
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



