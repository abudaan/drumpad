import React from 'react';
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
  updateEvents,
  playSampleFromPad,
  addRow,
  selectNoteNumber,
  removeRow,
  selectMIDIInPort,
  selectMIDIOutPort,
} from '../actions/actions'
import { State, SongPosition, GridType, MIDIEvent, GridSelectedPads } from '../interfaces';
import getInstrument from '../reducers/instrument_selector';
import Pads from '../components/pads';
import Controls from '../components/controls';
import Song from '../components/song';
import SamplesList from '../components/samples_list';

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
  position: string,
  sequencerReady: boolean,
  grid: GridType,
  trackList: Array<string>,
  songList: Array<string>,
  instrumentList: Array<[number, string]>,
  ticks: number,
  activeColumn: number,
  timestamp: number,
  updateInterval: number,
  granularityTicks: number,
  renderAction: string,
  timeEvents: Array<MIDIEvent>,
  allMIDIEvents: Array<MIDIEvent>,
  activeMIDIEventIds: Array<string>,
  midiEvent: MIDIEvent,
  noteNumbers: Array<number>,
  instrumentNoteNumbers: Array<number>,
  midiInputsList: Array<[string, string]>,
  midiOutputsList: Array<[string, string]>,
  connectedMIDIInputs: Array<[string, boolean]>,
  connectedMIDIOutputs: Array<[string, boolean]>,

  // from instrument_selector
  instrumentName: string,

  // actions
  loadConfig: (url: string) => (dispatch: Dispatch<AnyAction>) => void,
  selectSong: () => void,
  selectTrack: () => void,
  selectInstrument: () => void,
  setLoop: (b: boolean) => void,
  play: (e: React.MouseEvent) => void,
  stop: (e: React.MouseEvent) => void,
  choosingTempo: (e: React.ChangeEvent) => void,
  updateTempo: (e: React.MouseEvent) => void,
  updateEvents: (pads: GridSelectedPads) => void,
  updatePosition: (pos: SongPosition) => void,
  playSampleFromPad: (id: string, type: number) => void,
  addRow: () => void,
  selectNoteNumber: () => void,
  removeRow: (noteNumber: number) => void,
  selectMIDIInPort: (portId: string) => void,
  selectMIDIOutPort: (portId: string) => void,
};

const mapStateToProps = (state: State) => {
  return {
    ...getInstrument(state),

    // from song_reducer
    ppq: state.song.ppq,
    bpm: state.song.bpm,
    nominator: state.song.nominator,
    denominator: state.song.denominator,
    position: state.song.barsAsString,
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
    allMIDIEvents: state.song.allMIDIEvents,
    activeMIDIEventIds: state.song.activeMIDIEventIds,
    midiEvent: state.song.midiEvent,
    noteNumbers: state.song.noteNumbers,
    instrumentSamplesList: state.song.instrumentSamplesList,
    instrumentNoteNumbers: state.song.instrumentNoteNumbers,
    midiInputsList: state.song.midiInputsList,
    midiOutputsList: state.song.midiOutputsList,
    connectedMIDIInputs: state.song.connectedMIDIInputs,
    connectedMIDIOutputs: state.song.connectedMIDIOutputs,

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
    updateEvents,
    playSampleFromPad,
    addRow,
    selectNoteNumber,
    removeRow,
    selectMIDIInPort,
    selectMIDIOutPort,
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
        position={this.props.position}
        selectSong={this.props.selectSong}
        selectTrack={this.props.selectTrack}
        selectInstrument={this.props.selectInstrument}
        choosingTempo={this.props.choosingTempo}
        updateTempo={this.props.updateTempo}
        setLoop={this.props.setLoop}
        addRow={this.props.addRow}
        midiInputsList={this.props.midiInputsList}
        midiOutputsList={this.props.midiOutputsList}
        selectMIDIInPort={this.props.selectMIDIInPort}
        selectMIDIOutPort={this.props.selectMIDIOutPort}
      >
      </Controls>

      <div id="pads-container">
        <SamplesList
          removeRow={this.props.removeRow}
          selectNoteNumber={this.props.selectNoteNumber}
          noteNumbers={this.props.noteNumbers}
          instrumentNoteNumbers={this.props.instrumentNoteNumbers}
        />
        <Pads
          grid={this.props.grid}
          activeColumn={this.props.activeColumn}
          enabled={this.props.controlsEnabled}
          update={this.props.updateEvents}
          playSampleFromPad={this.props.playSampleFromPad}
          playing={this.props.playing}
        ></Pads>
      </div>

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
        allMIDIEvents={this.props.allMIDIEvents}
        activeMIDIEventIds={this.props.activeMIDIEventIds}
        timeEvents={this.props.timeEvents}
        trackIndex={this.props.trackIndex}
        instrumentName={this.props.instrumentName}
        playing={this.props.playing}
        stopped={this.props.stopped}
        tempo={this.props.tempo}
        loop={this.props.loop}
        midiEvent={this.props.midiEvent}
        connectedMIDIInputs={this.props.connectedMIDIInputs}
        connectedMIDIOutputs={this.props.connectedMIDIOutputs}
      >
      </Song>}
    </div>
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
