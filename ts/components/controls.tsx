// import * as R from 'ramda';
import React from 'react';
import Slider from './slider';
interface Controls {
  props: PropTypes,
};

type PropTypes = {
  enabled: boolean,
  tempoTmp: number,
  minTempo: number,
  maxTempo: number,
  playing: boolean,
  loop: boolean,
  songList: Array<string>,
  trackList: Array<string>,
  instrumentList: Array<[number, string]>,
  position: string,
  midiInputsList: Array<[string, string]>,
  midiOutputsList: Array<[string, string]>,
  midiOutLatencyTmp: number,

  choosingTempo: (event: React.ChangeEvent<HTMLInputElement>) => void,
  updateTempo: (event: React.FormEvent<HTMLInputElement>) => void,
  choosingMIDIOutLatency: (event: React.ChangeEvent<HTMLInputElement>) => void,
  updateMIDIOutLatency: (event: React.FormEvent<HTMLInputElement>) => void,
  play: (event: React.MouseEvent) => void,
  stop: (event: React.MouseEvent) => void,
  setLoop: (loop: boolean) => void,
  selectTrack: (value: number) => void,
  selectSong: (value: number) => void,
  selectInstrument: (value: number) => void,
  addRow: () => void,
  selectMIDIInPort: (portId: string) => void,
  selectMIDIOutPort: (portId: string) => void,
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
        return <option key={instrument[1]} value={instrument[0]}>{instrument[1]}</option>;
      });
      selectInstrument = <select
        onChange={(e) => {
          if (e.nativeEvent.target !== null) {
            const t = e.nativeEvent.target as HTMLSelectElement;
            this.props.selectInstrument(parseInt(t.options[t.selectedIndex].value, 10))
          }
        }}
      >
        {options}
      </select>
    }

    let selectMIDIIn;
    if (this.props.midiInputsList.length > 0) {
      const options: Array<JSX.Element> = this.props.midiInputsList.map(port => {
        return <option key={port[0]} value={port[0]}>{port[1]}</option>;
      });
      selectMIDIIn = <select
        onChange={e => {
          const t = e.nativeEvent.target as HTMLSelectElement;
          this.props.selectMIDIInPort(t.options[t.selectedIndex].value);
        }}
      >
        {options}
      </select>
    }

    let selectMIDIOut;
    if (this.props.midiOutputsList.length > 0) {
      const options: Array<JSX.Element> = this.props.midiOutputsList.map(port => {
        return <option key={port[0]} value={port[0]}>{port[1]}</option>;
      });
      selectMIDIOut = <select
        onChange={e => {
          const t = e.nativeEvent.target as HTMLSelectElement;
          this.props.selectMIDIOutPort(t.options[t.selectedIndex].value);
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
            e.nativeEvent.target === document.getElementById('matrix') ||
            e.nativeEvent.target === document.getElementById('samples-list')
          ) {
            e.preventDefault();
          }
        }}
      >
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

        <Slider
          min={this.props.minTempo}
          max={this.props.maxTempo}
          label="tempo"
          value={this.props.tempoTmp}
          onInput={this.props.updateTempo}
          onChange={this.props.choosingTempo}
          disabled={!this.props.enabled}
        />

        <button
          type="button"
          onClick={this.props.addRow}
        >add row</button>

        {selectMIDIFile}
        {selectTrack}
        {selectInstrument}
        {selectMIDIIn}
        {selectMIDIOut}

        <Slider
          min={0}
          max={1000}
          label="latency"
          value={this.props.midiOutLatencyTmp}
          onInput={this.props.updateMIDIOutLatency}
          onChange={this.props.choosingMIDIOutLatency}
          disabled={!this.props.enabled}
        />

        <div className="position">{this.props.position}</div>
      </div>
    );
  }
}
export default Controls;



