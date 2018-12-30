import React from 'react';
import { Dispatch, AnyAction } from 'redux';
import { connect } from 'react-redux';
import { loadData } from '../actions'
import { AppState } from '../interfaces';

interface Loader {
  props: PropTypes,
};

type PropTypes = {
  configUrl: string,
  sequencerReady: boolean,
  loadData: (url:string) => (dispatch: Dispatch<AnyAction>) => void,
};

const mapStateToProps = (state: AppState) => {
  return {
    sequencerReady: state.song.sequencerReady,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    loadData: (url:string) => {
      dispatch(loadData(url));
    }
  }
}


class Loader extends React.Component {
  constructor(props: PropTypes) {
    super(props);
    loadData(this.props.configUrl);
  }
  render() {
    if (this.props.sequencerReady) {
      this.props.loadData(this.props.configUrl);
    }
    return false;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Loader);
