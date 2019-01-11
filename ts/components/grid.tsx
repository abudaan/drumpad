import React, { RefObject } from 'react';
import GridCell from './cell';
import { GridType, GridCellData } from '../interfaces';

interface PropTypes {
  updateCells: (cells: Array<GridCellData>) => void,
  grid: GridType,
  activeColumn: number,
  enabled: boolean,
  playing: boolean,
};

interface Grid {
  props: PropTypes,
};

class Grid extends React.Component {
  divRef: RefObject<HTMLDivElement>
  dirtyCells: Array<GridCellData>

  constructor(props: PropTypes) {
    super(props);
    this.divRef = React.createRef();
    this.dirtyCells = [];
  }

  addDirtyCell(data: GridCellData) {
    this.dirtyCells.push(data);
  }

  dispatchUpdate() {
    const o: { [id: string]: GridCellData } = {};
    this.dirtyCells.forEach((c: GridCellData) => {
      const id = `${c.ticks}-${c.noteNumber}`
      o[id] = c;
    });
    const result = Object.values(o).map(data => data);
    this.props.updateCells(result);
    this.dirtyCells = [];
  }

  componentDidMount() {
    if (this.divRef.current !== null) {
      this.divRef.current.addEventListener('mouseup', () => {
        this.dispatchUpdate();
      });
      this.divRef.current.addEventListener('touchend', (e) => {
        this.dispatchUpdate();
      });
    }
  }

  render() {
    const numCols = this.props.grid.cols;
    const numRows = this.props.grid.rows;
    const cellStyle = {
      width: `calc((100vw - 30px) / ${numCols})`,
      height: `calc((100vh - 120px) / ${numRows})`,
    };
    const columns = [];
    let i = 0;
    for (let c = 0; c < numCols; c++) {
      const rows = [];
      const active = c === this.props.activeColumn;
      for (let r = 0; r < numRows; r++) {
        const item = this.props.grid.cells[i++];
        const classNames = ['cell'];
        if (item.midiEventId !== null) {
          if (active === true) {
            classNames.push('active');
          } else {
            classNames.push('selected');
          }
        }
        rows.push(
          <GridCell
            key={`cell-${i}-${r}`}
            style={cellStyle}
            className={classNames.join(' ')}
            item={item}
            addDirtyCell={this.addDirtyCell.bind(this)}
          ></GridCell>
        );
      }
      const classNames = ['column'];
      if (active) {
        classNames.push('active');
      }
      columns.push(
        <div key={`column${c}`} className={classNames.join(' ')}>{rows}</div>
      )
    }
    return (
      <div
        id="grid"
        ref={this.divRef}
      >
        {columns}
      </div>
    )
  }
}

export default Grid;
