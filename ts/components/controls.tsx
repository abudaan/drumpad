// import * as R from 'ramda';
import React, { ChangeEvent, MouseEvent } from 'react';
import Slider from './slider';
interface Controls {
  props: PropTypes,
};

type PropTypes = {
  enabled: boolean,
  tempo: number,
  tempoTmp: number,
  minTempo: number,
  maxTempo: number,
  playing: boolean,
  loop: boolean,
  songList: Array<string>,
  trackList: Array<string>,
  instrumentList: Array<string>,

  choosingTempo: (event: ChangeEvent) => void,
  updateTempo: (event: MouseEvent) => void,
  play: (event: MouseEvent) => void,
  stop: (event: MouseEvent) => void,
  setLoop: (loop: boolean) => void,
  setTrack: (value: number) => void,
  setMIDIFile: (value: number) => void,
  setInstrument: (value: number) => void,
};

class Controls extends React.PureComponent {
  static defaultProps = {
  }
  render() {
    const labelPlay = this.props.playing ? 'pause' : 'play';
    const labelLoop = this.props.loop ? 'loop off' : 'loop on';

    let selectMIDIFile;
    if (this.props.songList.length > 1) {
      const options = this.props.songList.map(s => {
        return <option key={s}>{s}</option>;
      });
      selectMIDIFile = <select
        onChange={(e) => {
          if (e.nativeEvent.target !== null) {
            this.props.setMIDIFile(e.nativeEvent.target.selectedIndex)
          }
        }}
      >
        {options}
      </select>
    }

    let selectTrack;
    if (this.props.trackList.length > 1) {
      const options = this.props.trackList.map(track => {
        return <option key={track}>{track}</option>;
      });
      selectTrack = <select
        onChange={(e) => {
          if (e.nativeEvent.target !== null) {
            this.props.setTrack(e.nativeEvent.target.selectedIndex)
          }
        }}
      >
        {options}
      </select>
    }

    let selectInstrument;
    if (this.props.instrumentList.length > 1) {
      const options = this.props.instrumentList.map(instrument => {
        return <option key={instrument}>{instrument}</option>;
      });
      selectInstrument = <select
        onChange={(e) => {
          if (e.nativeEvent.target !== null) {
            this.props.setInstrument(e.nativeEvent.target.selectedIndex)
          }
        }}
      >
        {options}
      </select>
    }
    return (<div id="controls">
      <Slider
        min={this.props.minTempo}
        max={this.props.maxTempo}
        label="tempo"
        value={this.props.tempoTmp}
        onMouseUp={this.props.updateTempo}
        onChange={this.props.choosingTempo}
        disabled={!this.props.enabled}
        />
      <button
        type="button"
        disabled={!this.props.enabled}
        onClick={this.props.play}
        >{labelPlay}</button>
      <button
        type="button"
        disabled={!this.props.enabled}
        onClick={this.props.stop}
        >stop</button>
      <button
        type="button"
        disabled={!this.props.enabled}
        onClick={(e) => { this.props.setLoop(!this.props.loop); }}
      >{labelLoop}</button>

      {selectMIDIFile}
      {selectTrack}
      {selectInstrument}

      {/* <button
        type="button"
        onClick={this.props.stop}
      >add beat</button>
      <button
        type="button"
        onClick={this.props.stop}
      >remove beat</button> */}
    </div>
    );
  }
}
export default Controls;



