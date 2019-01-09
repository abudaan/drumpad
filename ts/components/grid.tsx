import React, { ChangeEvent, MouseEvent } from 'react';
import GridItem from './cell';
import { GridCell, GridType, MIDIEvent, MIDINote } from '../interfaces';

interface PropTypes {
  onChange: (event: ChangeEvent) => void,
  onMouseDown?: (event: MouseEvent) => void,
  onMouseUp?: (event: MouseEvent) => void,
  grid: null | GridType,
  activeColumn: number,
  enabled: boolean,
  playing: boolean,
};

interface Grid {
  props: PropTypes,
};

class Grid extends React.Component {
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
      const active = c === this.props.activeColumn;
      for (let r = 0; r < numRows; r++) {
        const item = this.props.grid[c][r];
        const classNames = ['cell'];
        if (item.midiEvent !== null) {
          if (active === true) {
            classNames.push('active');
          } else {
            classNames.push('selected');
          }
        }
        rows.push(
          <GridItem
            key={`cell-${c}-${r}`}
            style={cellStyle}
            className={classNames.join(' ')}
            item={item}
            onChange={() => { }}
          ></GridItem>
        );
      }
      const classNames = ['column'];
      if(active) {
        classNames.push('active');
      }
      columns.push(
        <div key={`column${c}`} className={classNames.join(' ')}>{rows}</div>
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
