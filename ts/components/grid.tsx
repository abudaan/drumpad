import React, { SyntheticEvent } from 'react';
import { GridType, GridSelectedCells } from '../interfaces';
import { isNil } from 'ramda';

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

class Grid extends React.PureComponent {
  dirtyCells: GridSelectedCells
  lastCellIds: Array<null | string>

  constructor(props: PropTypes) {
    super(props);
    this.dirtyCells = {};
    this.lastCellIds = []];
  }

  componentDidMount() {
    requestAnimationFrame(this.dispatchUpdateWhilePlaying.bind(this));
  }

  onCellClick(e:SyntheticEvent) {
    const event = e.nativeEvent as TouchEvent;
    if (event.touches) {
      for(let i = 0; i < event.touches.length; i++) {
        const touch = event.touches[i];
        const target = document.elementFromPoint(touch.clientX, touch.clientY);
        if(target) {
          console.log(target);
          let id = target.id;
          if (id === '' && target.parentNode !== null) {
            const p = target.parentNode as HTMLDivElement;
            id = p.id;
          }
          if (isNil(id) === false) {
            if (this.lastCellIds[i] !== id) {
              this.lastCellIds[i] = id;
              this.dirtyCells[id] = !this.dirtyCells[id];
              // console.log(id, this.dirtyCells[id]);
            }
          }
          // console.log(touch, id, this.dirtyCells[id]);
          
          // if(this.props.playing === false) {
          //   const midiEventId = this.props.grid.cells[id].midiEventId;
          //   if (midiEventId !== null) {
          //     console.log(midiEventId);
          //   }
          // }
        }
      }
    }
  }

  dispatchUpdateWhilePlaying() {
    // perform some caching here in case of dragging / mousmove
    if (this.props.playing) {
      this.props.updateCells(this.dirtyCells);
    }
    requestAnimationFrame(this.dispatchUpdateWhilePlaying.bind(this));
  }

  dispatchUpdate() {
    if (this.props.playing === false) {
      this.props.updateCells(this.dirtyCells);
    }
  }

  render() {
    const numCols = this.props.grid.cols;
    const numRows = this.props.grid.rows;
    const cellStyle = {
      width: `calc((100vw - 30px) / ${numCols})`,
      height: `calc((100vh - 150px) / ${numRows})`,
    };
    const columns = [];
    let i = 0;
    for (let c = 0; c < numCols; c++) {
      const rows = [];
      const active = c === this.props.activeColumn;
      for (let r = 0; r < numRows; r++) {
        const item = this.props.grid.cells[i++];
        const classNames = ['cell'];
        const id = `${item.ticks}-${item.noteNumber}`
        if (item.selected === true) {
          if (active === true) {
            classNames.push('active');
          } else {
            classNames.push('selected');
          }
        }
        this.dirtyCells[id] = item.selected === true;
        rows.push(
          <div
            id={id}
            key={id}
            style={cellStyle}
            className={classNames.join(' ')}
          >
            {/* <span>{id}</span> */}
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
        // onMouseDown={this.onCellClick.bind(this)}
        onTouchStart={this.onCellClick.bind(this)}
        onTouchMove={this.onCellClick.bind(this)}
        // onMouseUp={this.dispatchUpdate.bind(this)}
        onTouchEnd={this.dispatchUpdate.bind(this)}
      >
        {columns}
      </div>
    )
  }
}

export default Grid;
