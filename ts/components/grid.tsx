import React, { ChangeEvent, MouseEvent } from 'react';
import Cell from './cell';
import { GridItem } from '../interfaces';

interface PropTypes {
  onChange: (event: ChangeEvent) => void,
  onMouseDown?: (event: MouseEvent) => void,
  onMouseUp?: (event: MouseEvent) => void,
  grid: null | Array<Array<GridItem>>,
  enabled: boolean,
  playing: boolean,
  activeNotes: Array<any>,
};

interface Grid {
  props: PropTypes,
};

class Grid extends React.Component {
  render() {
    if (this.props.grid === null) {
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
        rows.push(
          <Cell
            key={`cell-${c}-${r}`}
            style={cellStyle}
            className={item.midiEvent === null ? "cell" : "cell selected"}
            item={item}
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
