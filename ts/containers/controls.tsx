// import * as R from 'ramda';
import React, { ChangeEvent, MouseEvent } from 'react';
import { connect } from 'react-redux';
import Slider from '../components/slider';
import { AppState } from '../interfaces';
import {
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

type PropTypes = {
  disabled: boolean,
  beats: number,
  tempo: number,
  tempoTmp: number,
  minTempo: number,
  maxTempo: number,
  choosingTempo: (event: ChangeEvent) => void,
  updateTempo: (event: MouseEvent) => void,
  play: (event: MouseEvent) => void,
  stop: (event: MouseEvent) => void,
  playing: boolean,
};

const mapStateToProps = (state: AppState) => {
  return {
    disabled: !state.data.loading,
    playing: state.song.playing,
    tempo: state.song.tempo,
    tempoTmp: state.song.tempoTmp,
    minTempo: state.song.minTempo,
    maxTempo: state.song.maxTempo,
  };
};

type Event = {
  target: {
    value: number,
  }
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    choosingTempo: (e: ChangeEvent<HTMLInputElement>) => {
      dispatch(choosingTempo(parseInt(e.target.value, 10)));
    },
    updateTempo: (e: { target: HTMLInputElement; }) => {
      dispatch(updateTempo(parseInt(e.target.value, 10)));
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
      <button
        type="button"
        onClick={this.props.stop}
      >add beat</button>
      <button
        type="button"
        onClick={this.props.stop}
      >remove beat</button>
    </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Controls);



