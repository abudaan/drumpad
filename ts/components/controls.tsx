// import * as R from 'ramda';
import React from 'react';
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
  position: string,

  choosingTempo: (event: React.ChangeEvent) => void,
  updateTempo: (event: React.MouseEvent) => void,
  play: (event: React.MouseEvent) => void,
  stop: (event:React.MouseEvent) => void,
  setLoop: (loop: boolean) => void,
  selectTrack: (value: number) => void,
  selectSong: (value: number) => void,
  selectInstrument: (value: number) => void,
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
            const t = e.nativeEvent.target as HTMLSelectElement;
            this.props.selectSong(t.selectedIndex)
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
            const t = e.nativeEvent.target as HTMLSelectElement;
            this.props.selectTrack(t.selectedIndex)
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
            const t = e.nativeEvent.target as HTMLSelectElement;
            this.props.selectInstrument(t.selectedIndex)
          }
        }}
      >
        {options}
      </select>
    }
    return (
      <div
        id="controls"
        // trying to disable default scrolling behaviour of touch events on mobile devices as much as possible
        onTouchMoveCapture={e => {
          if (
            e.nativeEvent.target === document.getElementById('controls') ||
            e.nativeEvent.target === document.getElementById('container') ||
            e.nativeEvent.target === document.getElementById('grid')
          ) {
            e.preventDefault();
          }
        }}
      >
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
          onClick={() => { this.props.setLoop(!this.props.loop); }}
        >{labelLoop}</button>

        {selectMIDIFile}
        {selectTrack}
        {selectInstrument}
        <div className="position">{this.props.position}</div>

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



