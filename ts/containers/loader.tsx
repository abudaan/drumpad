import React from 'react';
import { Dispatch, AnyAction } from 'redux';
import { connect } from 'react-redux';
import { loadConfig } from '../actions'
import { AppState } from '../interfaces';
import getSongUpdate from '../reducers/song_selector'

interface Loader {
  props: PropTypes,
};

type PropTypes = {
  configUrl: string,
  sequencerReady: boolean,
  loadData: (url:string) => (dispatch: Dispatch<AnyAction>) => void,
};

const mapStateToProps = (state: AppState, ownProps: PropTypes) => {
  return {...getSongUpdate(state, ownProps)}
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    loadData: (url:string) => {
      dispatch(loadConfig(url));
    }
  }
}


class Loader extends React.Component {
  constructor(props: PropTypes) {
    super(props);
    loadConfig(this.props.configUrl);
  }
  render() {
    if (this.props.sequencerReady) {
      this.props.loadData(this.props.configUrl);
    }
    return false;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Loader);
