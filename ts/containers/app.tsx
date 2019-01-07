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
import { State, SongPosition, HeartbeatSong, AssetPack, MIDINote, GridItem, GridType } from '../interfaces';
// import getSong from '../reducers/song_selector';
// import getTrack from '../reducers/track_selector';
import getInstrument from '../reducers/instrument_selector';
import getActiveNotes from '../reducers/notes_selector';
import Grid from '../components/grid';
import Controls from '../components/controls';
import Song from '../components/song';

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
  grid: null | GridType,
  song: null | HeartbeatSong
  assetPack: null | AssetPack,
  trackList: Array<string>,
  songList: Array<HeartbeatSong>,
  instrumentList: Array<string>,
  timestamp: number,
  updateInterval: number,

  // from track_selector
  // grid: Array<Array<any>>,

  // from notes_selector
  activeNotes: Array<MIDINote>,

  // from instrument_selector
  instrumentName: string,

  // actions
  loadConfig: (url: string) => (dispatch: Dispatch<AnyAction>) => void,
  setTrack: () => void,
  setMIDIFile: () => void,
  setInstrument: () => void,
  setLoop: () => void,
  play: () => void,
  stop: () => void,
  choosingTempo: (e: ChangeEvent) => void,
  updateTempo: (e: Event<HTMLElement, Event>) => void,
  updatePosition: (pos: SongPosition) => void,
};

const mapStateToProps = (state: State) => {
  return {
    // ...getSong(state),
    // ...getTrack(state),
    ...getInstrument(state),
    ...getActiveNotes(state),

    // from song_reducer
    song: state.song.song,
    grid: state.song.grid,
    updateInterval: state.song.updateInterval,
    trackList: state.song.trackList,
    instrumentList: state.song.instrumentList,
    songList: state.song.songList,
    
    // from controls
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
    setTrack: selectTrack,
    setMIDIFile: selectSong,
    setInstrument: selectInstrument,
  }, dispatch);
}

class App extends React.PureComponent {
  constructor(props: PropTypes) {
    super(props);
  }

  updateUI() {
    if (this.props.song !== null) {
      const {
        barsAsString,
        activeNotes,
      } = this.props.song;
      
      const timestamp =  performance.now();

      if (this.props.playing && (timestamp - this.props.timestamp) >= 120) {
        this.props.updatePosition({
          timestamp,
          barsAsString,
          activeNotes,
        });
      }
    }
    requestAnimationFrame(this.updateUI.bind(this));
  }

  componentDidMount() {
    this.props.loadConfig(this.props.configUrl);
    requestAnimationFrame(this.updateUI.bind(this));
  }

  render() {
    // let s = '\n';
    // this.props.activeNotes.forEach(note => {
    //   s += `${note.number} ${note.ticks}\n`  
    // });
    // console.log('<App>', s);
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
        setTrack={this.props.setTrack}
        setInstrument={this.props.setInstrument}
        setMIDIFile={this.props.setMIDIFile}
        choosingTempo={this.props.choosingTempo}
        updateTempo={this.props.updateTempo}
        setLoop={this.props.setLoop}
      >
      </Controls>

      <Grid
        grid={this.props.grid}
        enabled={this.props.controlsEnabled}
        activeNotes={this.props.activeNotes}
        onChange={() => {}}
        playing={this.props.playing}
      ></Grid>

      <Song
        song={this.props.song}
        trackIndex={this.props.trackIndex}
        instrumentName={this.props.instrumentName}
        playing={this.props.playing}
        stopped={this.props.stopped}
        tempo={this.props.tempo}
        loop={this.props.loop}
      >
      </Song>
    </div>
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
