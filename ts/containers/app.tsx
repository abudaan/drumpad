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
  beat: number,
  configUrl: string,
  assetPack: null | Object,
  midiFile: null | ArrayBuffer,
  trackList: Array<string>,
  trackIndex: number,
  instrumentName: string,
  controlsEnabled: boolean,
  playing: boolean,
  stopped: boolean,
  loop: boolean,
  tempo: number,
  tempoTmp: number,
  tempoMin: number,
  tempoMax: number,
  notes: Array<any>,
  beats: Array<any>,
  activeNotes: Array<any>,
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

  updateUI() {
    if (this.props.song !== null) {
      const {
        bar,
        beat,
        barsAsString,
        activeNotes,
      } = this.props.song;

      this.props.updatePosition({
        bar,
        beat,
        barsAsString,
        activeNotes,
      });
    }
    requestAnimationFrame(this.updateUI.bind(this));
  }

  componentDidMount() {
    this.props.loadConfig(this.props.configUrl);
    requestAnimationFrame(this.updateUI.bind(this));
  }

  render() {
    // const s = '\n';
    // this.props.activeNotes.forEach(note => {
    //   s += `${note.note.number} ${note.ticks}\n`  
    // });
    // console.log('<App>', s);
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
        beat={this.props.beat}
        notes={this.props.notes}
        beats={this.props.beats}
        playing={this.props.playing}
        enabled={this.props.controlsEnabled}
        activeNotes={this.props.activeNotes}
      ></Grid>
      <Song
        song={this.props.song}
        trackIndex={this.props.trackIndex}
        instrumentName={this.props.instrumentName}
        playing={this.props.playing}
        stopped={this.props.stopped}
        tempo={this.props.tempo}
        loop={this.props.loop}
        stop={this.props.stop}
      >
      </Song>
    </div>
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
