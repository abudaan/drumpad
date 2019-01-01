// import * as R from 'ramda';
import React, { ChangeEvent, MouseEvent } from 'react';
import { connect } from 'react-redux';
import Slider from '../components/slider';
import { AppState } from '../interfaces';
import {
  choosingTempo,
  updateTempo,
  setLoop,
  setTrack,
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
  setLoop: (loop: boolean) => void,
  setTrack: (value: number) => void,
  playing: boolean,
  loop: boolean,
  tracks: Array<any>,
};

const mapStateToProps = (state: AppState) => {
  return {
    disabled: !state.data.songReady,
    tracks: state.data.tracks,
    playing: state.song.playing,
    loop: state.song.loop,
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
    setLoop: (loop: boolean) => {
      dispatch(setLoop(loop));
    },
    setTrack: (value: number) => {
      dispatch(setTrack(value));
    },
  }
}

class Controls extends React.Component {
  static defaultProps = {
  }
  render() {
    const labelPlay = this.props.playing ? 'pause' : 'play';
    const labelLoop = this.props.loop ? 'loop off' : 'loop on';
    const options = this.props.tracks.map(track => {
      return <option key={track.value} value={track.value}>{track.label}</option>;
    });
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
      >{labelPlay}</button>
      <button
        type="button"
        onClick={this.props.stop}
      >stop</button>
      <button
        type="button"
        onClick={(e) => { this.props.setLoop(!this.props.loop); }}
      >{labelLoop}</button>
      <select
        onChange={(e) => {
          this.props.setTrack(e.nativeEvent.target.selectedIndex)
        }} 
      >
        {options}
      </select>

      {/* <button
        type="button"
        onClick={this.props.stop}
      >add beat</button>
      <button
        type="button"
        onClick={this.props.stop}
      >remove beat</button> */}
    </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Controls);



