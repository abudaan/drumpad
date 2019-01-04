import React, { ChangeEvent } from 'react';
import { Dispatch, AnyAction, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  loadConfig,
  choosingTempo,
  updateTempo,
  updatePosition,
  setLoop,
  setTrack,
  play,
  stop,
} from '../actions'
import { State, SongPosition, HeartbeatSong } from '../interfaces';
import getAppProps from '../reducers/app_selector'
import getSongProps from '../reducers/song_selector'
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
  trackList: Array<string>,
  trackIndex: number,
  instrumentIndex: number,
  controlsEnabled: boolean,
  playing: boolean,
  stopped: boolean,
  loop: boolean,
  tempo: number,
  tempoTmp: number,
  tempoMin: number,
  tempoMax: number,
  rows: number,
  columns: number,
  song: null | HeartbeatSong,
  loadConfig: (url: string) => (dispatch: Dispatch<AnyAction>) => void,
  setTrack: () => void,
  setLoop: () => void,
  play: () => void,
  stop: () => void,
  choosingTempo: (e: ChangeEvent) => void,
  updateTempo: (e: Event<HTMLElement, Event>) => void,
  updatePosition: (pos: SongPosition) => void,
};

const mapStateToProps = (state: State) => {
  return { 
    ...getAppProps(state) 
    // ...getSongProps(state) 
  }
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return bindActionCreators({
    loadConfig,
    choosingTempo,
    updateTempo,
    updatePosition,
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
    console.log('<App>');
    return <div>
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
      <Grid
        rows={this.props.rows}
        columns={this.props.columns}
        enabled={this.props.controlsEnabled}
        ></Grid>
      <Song
        song={this.props.song}
        trackIndex={this.props.trackIndex}
        instrumentIndex={this.props.instrumentIndex}
        playing={this.props.playing}
        stopped={this.props.stopped}
        tempo={this.props.tempo}
        loop={this.props.loop}
        stop={this.props.stop}
        updatePosition={this.props.updatePosition}
      >
      </Song>
    </div>
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
