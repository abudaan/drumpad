import React, { RefObject } from 'react';
import GridCell from './cell';
import { GridType } from '../interfaces';

interface PropTypes {
  updateCells: (selectedCells: Array<{ ticks: number, noteNumber: number, selected: boolean }>) => void,
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
  dirtyCells: Array<{ id: string, selected: boolean }>
  state: {
    dragActive: boolean,
  }

  constructor(props: PropTypes) {
    super(props);
    this.state = {
      dragActive: false,
    };
    this.divRef = React.createRef();
    this.dirtyCells = [];
  }

  addDirtyCell(div: HTMLDivElement) {
    const selected = div.className.indexOf('selected') !== -1;
    this.dirtyCells.push({
      id: div.id,
      selected,
    });
    div.className = selected ? 'cell selected' : 'cell';
  }

  dispatchUpdate() {
    const cells = this.dirtyCells.filter(data => data.id !== '');
    const o: { [id: string]: { id: string, selected: boolean } } = {};
    cells.forEach(c => {
      o[c.id] = c;
    });
    const result = Object.values(o).map(data => {
      const [
        ticks,
        noteNumber,
      ] = data.id.split('-');
      return {
        ticks,
        noteNumber,
        selected: data.selected,
      };
    })
    // this.props.updateCells(Object.values(o));
    console.log('DISPATCH', result);
  }

  componentDidMount() {
    if (this.divRef.current !== null) {
      this.divRef.current.addEventListener('mousedown', () => {
        if (this.state.dragActive === false) {
          this.setState({ dragActive: true });
        }
      });
      this.divRef.current.addEventListener('mouseup', () => {
        if (this.state.dragActive === true) {
          this.setState({ dragActive: false });
        }
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
        if (item.midiEvent !== null) {
          if (active === true) {
            classNames.push('active');
          } else {
            classNames.push('selected');
          }
        }
        rows.push(
          <GridCell
            dragActive={this.state.dragActive}
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
