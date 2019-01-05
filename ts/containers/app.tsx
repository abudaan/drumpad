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
  setMIDIFile,
  setInstrument,
  play,
  stop,
} from '../actions'
import { State, SongPosition, HeartbeatSong, AssetPack, MIDINote } from '../interfaces';
import getTrackProps from '../reducers/track_selector';
import getActiveNotes from '../reducers/notes_selector';
import getInstrument from '../reducers/instrument_selector';
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
  song: null | HeartbeatSong
  assetPack: null | AssetPack,
  trackList: Array<string>,
  midiFileList: Array<string>,
  instrumentList: Array<string>,
  beat: number,
  sixteenth: number,
  
  // from track_selector
  noteNumbers: Array<number>,
  
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
    ...getTrackProps(state),
    ...getActiveNotes(state),
    ...getInstrument(state),

    // from song_reducer
    song: state.song.song,
    trackList: state.song.trackList,
    instrumentList: state.song.instrumentList,
    midiFileList: state.song.midiFileList,
    beat: state.song.beat,
    sixteenth: state.song.sixteenth,

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
    setTrack,
    setMIDIFile,
    setInstrument,
  }, dispatch);
}

class App extends React.PureComponent {
  constructor(props: PropTypes) {
    super(props);
  }

  updateUI() {
    if (this.props.song !== null) {
      const {
        bar,
        beat,
        sixteenth,
        barsAsString,
        activeNotes,
      } = this.props.song;
      
      if(sixteenth !== this.props.sixteenth) {
        this.props.updatePosition({
          bar,
          beat,
          sixteenth,
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
        midiFileList={this.props.midiFileList}
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

      {/* <Grid
        beat={this.props.beat}
        notes={this.props.notes}
        beats={this.props.beats}
        playing={this.props.playing}
        enables={this.props.controlsEnabled}
        activeNotes={this.props.activeNotes}
      ></Grid> */}

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
