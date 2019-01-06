import React, { ChangeEvent, MouseEvent } from 'react';
import Cell from './cell';
import { GridItem } from '../interfaces';

interface PropTypes {
  onChange: (event: ChangeEvent) => void,
  onMouseDown?: (event: MouseEvent) => void,
  onMouseUp?: (event: MouseEvent) => void,
  grid: Array<Array<GridItem>>,
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
    const numRows = this.props.grid.length;
    const numColumns = this.props.grid[0].length
    const cellStyle = {
      width: `calc((100vw - 30px) / ${numRows})`,
      height: `calc((100vh - 120px) / ${numColumns})`,
    };
    const rows = [];
    for (let i = 0; i < numRows; i++) {
      const columns = [];
      for (let j = 0; j < numColumns; j++) {
        const item = this.props.grid[i][j];
        columns.push(
          <Cell
            key={`cell-${i}-${j}`}
            style={cellStyle}
            className="cell"
            item={item}
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
