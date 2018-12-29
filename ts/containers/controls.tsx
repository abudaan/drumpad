// import * as R from 'ramda';
import React, { ChangeEvent } from 'react';
import {connect} from 'react-redux';
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
  updateBeats: (event: ChangeEvent) => void
};

const mapStateToProps = (state:AppState) => {
  return {
    beats: state.song.beats,
  };
};

const mapDispatchToProps = (dispatch:Dispatch) => {
  return {
    updateBeats: (e) => {
      dispatch(updateBeats(e.target.value));
    },
  }
}

class Controls extends React.Component {
  static defaultProps = {
  }
  render() {
    return (<div id="controls">
    <Slider
      min={10}
      max={3000}
      label="width"
      value={this.props.beats}
      onChange={this.props.updateBeats}
    />      
      </div>
      );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Controls);



