import React, { ChangeEvent, MouseEvent } from 'react';
import Cell from './cell';
import { GridItem, GridType, MIDIEvent, MIDINote } from '../interfaces';

interface PropTypes {
  onChange: (event: ChangeEvent) => void,
  onMouseDown?: (event: MouseEvent) => void,
  onMouseUp?: (event: MouseEvent) => void,
  grid: null | GridType,
  enabled: boolean,
  playing: boolean,
  activeNotes: Array<MIDINote>,
};

interface Grid {
  props: PropTypes,
};

class Grid extends React.Component {
  checkActive(event: MIDIEvent) {
    if (this.props.playing === false) {
      return false;
    }
    for(let i = 0; i < this.props.activeNotes.length; i++) {
      const note = this.props.activeNotes[i];
      // console.log (note.ticks, event.ticks, note.number, event.noteNumber);
      if (note.ticks === event.ticks && note.number === event.noteNumber) {
        return true;
      }
    }
    return false;  
  }

  render() {
    if (!this.props.grid) {
      return false;
    }
    const numColumns = this.props.grid.length;
    const numRows = this.props.grid[0].length;
    const cellStyle = {
      width: `calc((100vw - 30px) / ${numColumns})`,
      height: `calc((100vh - 120px) / ${numRows})`,
    };
    const columns = [];
    for (let c = 0; c < numColumns; c++) {
      const rows = [];
      for (let r = 0; r < numRows; r++) {
        const item = this.props.grid[c][r];
        const classNames = ['cell'];
        if (item.midiEvent !== null) {
          if (this.checkActive(item.midiEvent) === true) {
            classNames.push('active');
          } else {
            classNames.push('selected');
          }
        }
        rows.push(
          <Cell
            key={`cell-${c}-${r}`}
            style={cellStyle}
            className={classNames.join(' ')}
            item={item}
            onChange={() => { }}
          ></Cell>
        );
      }
      columns.push(
        <div key={`column${c}`} className="column">{rows}</div>
      )
    }
    return (
      <div id="grid">
        {columns}
      </div>
    )
  }
}

export default Grid;
