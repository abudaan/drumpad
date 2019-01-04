import React, { ChangeEvent, MouseEvent } from 'react';
import Cell from './cell';

interface PropTypes {
  onChange: (event: ChangeEvent) => void,
  onMouseDown?: (event: MouseEvent) => void,
  onMouseUp?: (event: MouseEvent) => void,
  beats: Array<any>,
  notes: Array<any>,
  disabled: boolean,
  playing: boolean,
  activeNotes: Array<any>,
};

interface Grid {
  props: PropTypes,
};

class Grid extends React.Component {

  checkActive(ticks, noteNumber, playing) {
    if (playing === false) {
      return 'cell';
    }
    const notes = this.props.activeNotes;
    for(let i = 0; i < notes.length; i++) {
      const note = notes[i];
      if (note.ticks === ticks && note.note.number === noteNumber) {
        return 'cell active';
      }
    }
    return 'cell';
  }

  render() {
    const numRows = this.props.notes.length;
    const numColumns = this.props.beats.length
    const cellStyle = {
      width: `calc((100vw - 30px) / ${numRows})`,
      height: `calc((100vh - 120px) / ${numColumns})`,
    };
    const rows = [];
    for (let i = 0; i < numRows; i++) {
      const columns = [];
      for (let j = 0; j < numColumns; j++) {
        const ticks = this.props.beats[j];
        const noteNumber = this.props.notes[i];
        columns.push(
          <Cell
            key={`cell-${i}-${j}`}
            style={cellStyle}
            className={this.checkActive(ticks, noteNumber, this.props.playing)}
            ticks={ticks}
            noteNumber={noteNumber}
          ></Cell>
        );
      }
      rows.push(
        <div key={`row${i}`} className="row">{columns}</div>
      )
    }
    return (
      <div id="grid">
        {rows}
      </div>
    )
  }
}

export default Grid;
