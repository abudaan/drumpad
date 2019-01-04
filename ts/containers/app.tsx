import React, { ChangeEvent } from 'react';
import { Dispatch, AnyAction, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  loadConfig,
  songReady,
  choosingTempo,
  updateTempo,
  setLoop,
  setTrack,
  play,
  stop,
} from '../actions'
import { State } from '../interfaces';
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
  trackList: Array<any>,
  trackIndex: number,
  instrumentIndex: number,
  controlsEnabled: boolean,
  playing: boolean,
  loop: boolean,
  tempo: number,
  tempoTmp: number,
  tempoMin: number,
  tempoMax: number,
  columns: number,
  rows: number,
  loadConfig: (url: string) => (dispatch: Dispatch<AnyAction>) => void,
  songReady: () => void,
  setTrack: () => void,
  setLoop: () => void,
  play: () => void,
  stop: () => void,
  choosingTempo: (e: ChangeEvent) => void,
  updateTempo: (e: Event<HTMLElement, Event>) => void,
};

const mapStateToProps = (state: State) => {
  return { ...getAppProps(state) }
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return bindActionCreators({
    loadConfig,
    songReady,
    choosingTempo,
    updateTempo,
    play,
    stop,
    setLoop,
    setTrack,
  }, dispatch);
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
        columns={4}
        rows={4}
        enabled={this.props.controlsEnabled}
      ></Grid>
      <Song
        assetPack={this.props.assetPack}
        midiFile={this.props.midiFile}
        trackIndex={this.props.trackIndex}
        instrumentIndex={this.props.instrumentIndex}
        songReady={this.props.songReady}
        playing={this.props.playing}
        tempo={this.props.tempo}
        loop={this.props.loop}
      >
      </Song>
      <Controls
        enabled={this.props.controlsEnabled}
        disabled={!this.props.controlsEnabled}
        trackList={this.props.trackList}
        playing={this.props.playing}
        loop={this.props.loop}
        tempo={this.props.tempo}
        tempoTmp={this.props.tempoTmp}
        minTempo={this.props.tempoMin}
        maxTempo={this.props.tempoMax}
        play={this.props.play}
        stop={this.props.stop}
        setTrack={this.props.setTrack}
        choosingTempo={this.props.choosingTempo}
        updateTempo={this.props.updateTempo}
        setLoop={this.props.setLoop}
      >
      </Controls>
    </div>
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
