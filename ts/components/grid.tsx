import React, { ChangeEvent, MouseEvent, RefObject, SyntheticEvent } from 'react';
import GridCell from './cell';
import { GridType, GridCellData } from '../interfaces';
import { string } from 'prop-types';

interface PropTypes {
  onChange: (selectedCells: Array<{ ticks: number, noteNumber: number, selected: boolean }>) => void,
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
  dragActive: boolean
  dirtyCells: Array<{ id: string, selected: boolean }>
  firstClickedCell: null | HTMLDivElement
  state: {
    dragActive: boolean,
  }
  timeout: null | NodeJS.Timeout

  constructor(props: PropTypes) {
    super(props);
    this.state = {
      dragActive: false,
    };
    this.dragActive = false;
    this.dirtyCells = [];
    this.firstClickedCell = null;
    this.divRef = React.createRef();
    this.timeout = null;
  }

  addDirtyCell(div: HTMLDivElement) {
    const selected = this.isSelected(div);
    this.dirtyCells.push({
      id: div.id,
      selected,
    });
    div.className = selected ? 'cell selected' : 'cell';
  }

  isSelected(div: HTMLDivElement): boolean {
    return div.className.indexOf('selected') !== -1
  }

  dispatchUpdate() {
    const cells = this.dirtyCells.filter(data => data.id !== '');
    const o: { [id: string]: {id: string, selected: boolean}} = {};
    cells.forEach(c => {
      o[c.id] = c;
    });
    console.log('DISPATCH', Object.values(o));
  }

  onMouseOver(e: SyntheticEvent) {
    if (e.nativeEvent.target && this.dragActive) {
      const div = e.nativeEvent.target as HTMLDivElement;
      this.addDirtyCell(div)
    }
  }

  componentDidMount() {
    if (this.divRef.current !== null) {
      this.divRef.current.addEventListener('mousedown', (e) => {
        this.dragActive = true;
        this.dirtyCells = [];
        if (e.target) {
          const div = e.target as HTMLDivElement;
          this.addDirtyCell(div);
        }
      });
      this.divRef.current.addEventListener('mouseup', (e) => {
        this.dragActive = false;
        this.dispatchUpdate();
        // if (e.target) {
        //   const div = e.target as HTMLDivElement;
        //   div.className = this.updateClassname(div.className);
        // }
      });
    }
    // if (this.divRef.current !== null) {
    //   this.divRef.current.addEventListener('mousedown', () => {
    //     this.timeout = setTimeout(() => {
    //       this.setState({dragActive: true});
    //     }, 100);
    //   });
    //   this.divRef.current.addEventListener('mouseup', () => {
    //     if(this.timeout !== null) {
    //       clearTimeout(this.timeout)
    //     }
    //     if (this.state.dragActive === true) {
    //       this.setState({dragActive: false});
    //     }
    //   });
    // }
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
            // dragActive={this.state.dragActive}
            key={`cell-${i}-${r}`}
            style={cellStyle}
            className={classNames.join(' ')}
            item={item}
            onChange={this.props.onChange}
            onMouseOver={this.onMouseOver.bind(this)}
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
