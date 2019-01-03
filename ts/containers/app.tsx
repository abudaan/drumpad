import React from 'react';
import { Dispatch, AnyAction } from 'redux';
import { connect } from 'react-redux';
import { loadConfig, songReady } from '../actions'
import { State, SongInfo } from '../interfaces';
import getAppProps from '../reducers/app_selector'
import Grid from '../components/grid';
import Controls from '../components/controls';
import Song from '../components/song';

interface App {
  props: PropTypes,
};

type PropTypes = {
  configUrl: string,
  assetPack: null | Object,
  midiFile: null | ArrayBuffer,
  trackIndex: number,
  instrumentIndex: number,
  controlsEnabled: boolean,
  playing: boolean,
  loadConfig: (url: string) => (dispatch: Dispatch<AnyAction>) => void,
  songReady: () => void,
};

const mapStateToProps = (state: State) => {
  return { ...getAppProps(state) }
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    loadConfig: (url: string) => {
      dispatch(loadConfig(url));
    },
    songReady: (info: SongInfo) => {
      dispatch(songReady(info));
    }
  }
}

class App extends React.PureComponent {
  constructor(props: PropTypes) {
    super(props);
  }

  componentDidMount() {
    this.props.loadConfig(this.props.configUrl);
  }

  render() {
    console.log('<App>', this.props);
    return <div>
      <Grid
        columns="4"
        rows="4"
        enabled={this.props.controlsEnabled}
        ></Grid>
      <Song
        assetPack={this.props.assetPack}
        midiFile={this.props.midiFile}
        trackIndex={this.props.trackIndex}
        instrumentIndex={this.props.instrumentIndex}
        songReady={this.props.songReady}
        playing={this.props.playing}
        >
      </Song>
      <Controls
        enabled={this.props.controlsEnabled}
      >
      </Controls>
    </div>
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
