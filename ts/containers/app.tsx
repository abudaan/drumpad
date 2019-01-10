import React, { ChangeEvent } from 'react';
import { Dispatch, AnyAction, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  loadConfig,
  choosingTempo,
  updateTempo,
  updatePosition,
  setLoop,
  selectTrack,
  selectSong,
  selectInstrument,
  play,
  stop,
} from '../actions/actions'
import { State, SongPosition, HeartbeatSong, AssetPack, MIDINote, GridCell, GridType, MIDIEvent } from '../interfaces';
import getInstrument from '../reducers/instrument_selector';
import Grid from '../components/grid';
import Controls from '../components/controls';
import Song, { INIT } from '../components/song';

interface App {
  props: PropTypes,
};

type PropTypes = {
  // passed
  configUrl: string,

  // from controls_reducer
  trackIndex: number,
  controlsEnabled: boolean,
  playing: boolean,
  stopped: boolean,
  loop: boolean,
  tempo: number,
  tempoTmp: number,
  tempoMin: number,
  tempoMax: number,

  // from song_reducer
  ppq: number,
  bpm: number,
  nominator: number,
  denominator: number,
  sequencerReady: boolean,
  grid: null | GridType,
  trackList: Array<string>,
  songList: Array<string>,
  instrumentList: Array<string>,
  ticks: number,
  activeColumn: number,
  timestamp: number,
  updateInterval: number,
  granularityTicks: number,
  renderAction: string,
  timeEvents: Array<MIDIEvent>,
  midiEvents: Array<MIDIEvent>,

  // from instrument_selector
  instrumentName: string,

  // actions
  loadConfig: (url: string) => (dispatch: Dispatch<AnyAction>) => void,
  selectSong: () => void,
  selectTrack: () => void,
  selectInstrument: () => void,
  setLoop: () => void,
  play: () => void,
  stop: () => void,
  choosingTempo: (e: ChangeEvent) => void,
  updateTempo: (e: Event<HTMLElement, Event>) => void,
  updatePosition: (pos: SongPosition) => void,
};

const mapStateToProps = (state: State) => {
  return {
    ...getInstrument(state),

    // from song_reducer
    ppq: state.song.ppq,
    bpm: state.song.bpm,
    nominator: state.song.nominator,
    denominator: state.song.denominator,
    sequencerReady: state.song.sequencerReady,
    grid: state.song.grid,
    updateInterval: state.song.updateInterval,
    trackList: state.song.trackList,
    instrumentList: state.song.instrumentList,
    songList: state.song.songList,
    ticks: state.song.ticks,
    activeColumn: state.song.activeColumn,
    granularityTicks: state.song.granularityTicks,
    renderAction: state.song.renderAction,
    timeEvents: state.song.timeEvents,
    midiEvents: state.song.midiEvents,

    // from controls_reducer
    trackIndex: state.controls.trackIndex,
    instrumentIndex: state.controls.instrumentIndex,
    controlsEnabled: state.controls.controlsEnabled,
    playing: state.controls.playing,
    stopped: state.controls.stopped,
    loop: state.controls.loop,
    tempo: state.controls.tempo,
    tempoTmp: state.controls.tempoTmp,
    tempoMin: state.controls.tempoMin,
    tempoMax: state.controls.tempoMax,
    timestamp: state.controls.timestamp,
  };
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
    selectTrack,
    selectSong,
    selectInstrument,
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
    return <div>
      <Controls
        enabled={this.props.controlsEnabled}
        trackList={this.props.trackList}
        songList={this.props.songList}
        instrumentList={this.props.instrumentList}
        playing={this.props.playing}
        loop={this.props.loop}
        tempo={this.props.tempo}
        tempoTmp={this.props.tempoTmp}
        minTempo={this.props.tempoMin}
        maxTempo={this.props.tempoMax}
        play={this.props.play}
        stop={this.props.stop}
        selectSong={this.props.selectSong}
        selectTrack={this.props.selectTrack}
        selectInstrument={this.props.selectInstrument}
        choosingTempo={this.props.choosingTempo}
        updateTempo={this.props.updateTempo}
        setLoop={this.props.setLoop}
      >
      </Controls>

      <Grid
        grid={this.props.grid}
        activeColumn={this.props.activeColumn}
        enabled={this.props.controlsEnabled}
        onChange={() => { }}
        playing={this.props.playing}
      ></Grid>

      { this.props.sequencerReady === true && 
      <Song
        updateInterval={this.props.updateInterval}
        granularityTicks={this.props.granularityTicks}
        updatePosition={this.props.updatePosition}
        timestamp={this.props.timestamp}
        ppq={this.props.ppq}
        bpm={this.props.bpm}
        nominator={this.props.nominator}
        denominator={this.props.denominator}
        renderAction={this.props.renderAction}
        midiEvents={this.props.midiEvents}
        timeEvents={this.props.timeEvents}
        trackIndex={this.props.trackIndex}
        instrumentName={this.props.instrumentName}
        playing={this.props.playing}
        stopped={this.props.stopped}
        tempo={this.props.tempo}
        loop={this.props.loop}
      >
      </Song>}
    </div>
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
