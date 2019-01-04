// import * as R from 'ramda';
import React, { ChangeEvent, MouseEvent } from 'react';
import Slider from './slider';
interface Controls {
  props: PropTypes,
};

type PropTypes = {
  disabled: boolean,
  beats: number,
  tempo: number,
  tempoTmp: number,
  minTempo: number,
  maxTempo: number,
  choosingTempo: (event: ChangeEvent) => void,
  updateTempo: (event: MouseEvent) => void,
  play: (event: MouseEvent) => void,
  stop: (event: MouseEvent) => void,
  setLoop: (loop: boolean) => void,
  setTrack: (value: number) => void,
  playing: boolean,
  loop: boolean,
  trackList: Array<any>,
};

class Controls extends React.PureComponent {
  static defaultProps = {
  }
  render() {
    const labelPlay = this.props.playing ? 'pause' : 'play';
    const labelLoop = this.props.loop ? 'loop off' : 'loop on';
    let select;
    if (this.props.trackList.length > 1) {
      const options = this.props.trackList.map(track => {
        return <option key={track}>{track}</option>;
      });
      select = <select
        onChange={(e) => {
          if (e.nativeEvent.target !== null) {
            this.props.setTrack(e.nativeEvent.target.selectedIndex)
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
        disabled={this.props.disabled}
      />
      <button
        type="button"
        onClick={this.props.play}
      >{labelPlay}</button>
      <button
        type="button"
        onClick={this.props.stop}
      >stop</button>
      <button
        type="button"
        onClick={(e) => { this.props.setLoop(!this.props.loop); }}
      >{labelLoop}</button>

      {select}

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



