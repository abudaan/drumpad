import React, { ChangeEvent, MouseEvent, RefObject } from 'react';
import GridCell from './cell';
import { GridType } from '../interfaces';

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
  state: {
    dragActive: boolean,
  }
  timeout: null | NodeJS.Timeout

  constructor(props: PropTypes) {
    super(props);
    this.state = {
      dragActive: false,
    };
    this.divRef = React.createRef();
    this.timeout = null;
  }

  componentDidMount() {
    if (this.divRef.current !== null) {
      this.divRef.current.addEventListener('mousedown', () => {
        this.timeout = setTimeout(() => {
          this.setState({dragActive: true});
        }, 100);
      });
      this.divRef.current.addEventListener('mouseup', () => {
        if(this.timeout !== null) {
          clearTimeout(this.timeout)
        }
        if (this.state.dragActive === true) {
          this.setState({dragActive: false});
        }
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
            onChange={this.props.onChange}
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
