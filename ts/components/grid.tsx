import React, { SyntheticEvent } from 'react';
import { GridType, GridSelectedCells } from '../interfaces';

interface PropTypes {
  updateCells: (cells: GridSelectedCells) => void,
  grid: GridType,
  activeColumn: number,
  enabled: boolean,
  playing: boolean,
};

interface Grid {
  props: PropTypes,
};

class Grid extends React.Component {
  dirtyCells: GridSelectedCells

  constructor(props: PropTypes) {
    super(props);
    this.dirtyCells = {};
  }

  onCellClick(e:SyntheticEvent) {
    if(e.nativeEvent.target) {
      const t = e.nativeEvent.target as HTMLElement;
      let id = t.id;
      if (id === '' && t.parentNode !== null) {
        const p = t.parentNode as HTMLDivElement;
        id = p.id;
      }
      const s = this.props.grid.cells[id].selected;
      this.dirtyCells[id] = !s
      
      if(this.props.playing === false) {
        const midiEventId = this.props.grid.cells[id].midiEventId;
        if (midiEventId !== null) {
          console.log(midiEventId);
        }
      }
    }
  }

  dispatchUpdate() {
    // perform some caching here in case of dragging / mousmove
    this.props.updateCells(this.dirtyCells);
    this.dirtyCells = {};
  }

  render() {
    const cells = Object.values(this.props.grid.cells);
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
        const item = cells[i++];
        const classNames = ['cell'];
        const id = `${item.ticks}-${item.noteNumber}`
        if (item.midiEventId !== null) {
          if (active === true) {
            classNames.push('active');
          } else {
            classNames.push('selected');
          }
        }
        rows.push(
          <div
            id={id}
            key={id}
            style={cellStyle}
            className={classNames.join(' ')}
          >
            <span>{id}</span>
          </div>
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
        onMouseDown={this.onCellClick.bind(this)}
        onTouchStart={this.onCellClick.bind(this)}
        onMouseUp={this.dispatchUpdate.bind(this)}
        onTouchEnd={this.dispatchUpdate.bind(this)}
      >
        {columns}
      </div>
    )
  }
}

export default Grid;
