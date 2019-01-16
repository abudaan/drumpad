import React, { SyntheticEvent } from 'react';
import { GridType, GridSelectedCells } from '../interfaces';
import GridCell from './gridcell';

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
  hasTouchMoved: boolean
  changed: number

  constructor(props: PropTypes) {
    super(props);
    this.dirtyCells = {};
    this.lastCellIds = [];
    this.hasTouchMoved = false;
    this.changed = 0;
  }

  componentDidMount() {
    requestAnimationFrame(this.dispatchUpdateWhilePlaying.bind(this));
  }

  getCellId(event: MouseEvent | Touch) {
    const target = document.elementFromPoint(event.clientX, event.clientY);
    let id = null;
    if (target) {
      id = target.id;
      if (id === '' && target.parentNode !== null) {
        const p = target.parentNode as HTMLDivElement;
        id = p.id;
      }
    }
    return id;
  }

  onCellClick(se: SyntheticEvent) {
    const e = se.nativeEvent;
    // console.log(e.type);
    if (e.type === 'touchstart') {
      this.hasTouchMoved = false;
    } else if (e.type === 'touchmove') {
      this.hasTouchMoved = true;
      const event = e as TouchEvent;
      for (let i = 0; i < event.touches.length; i++) {
        const touch = event.touches[i];
        const id = this.getCellId(touch);
        if (id !== null) {
          if (this.lastCellIds[i] !== id) {
            this.changed++;
            this.lastCellIds[i] = id;
            this.dirtyCells[id] = !this.dirtyCells[id];
          }
        }
      }
    } else if (e.type === 'touchend') {
      if (this.hasTouchMoved) {
        // console.log('cancel');
        return;
      }
      const event = e as TouchEvent;
      for (let i = 0; i < event.changedTouches.length; i++) {
        const touch = event.changedTouches[i];
        const id = this.getCellId(touch);
        if (id !== null) {
          this.changed++;
          this.dirtyCells[id] = !this.dirtyCells[id];
        }
      }
    } else if (e.type === 'click') {
      const event = e as MouseEvent
      const id = this.getCellId(event);
      if (id !== null) {
        this.changed++;
        this.dirtyCells[id] = !this.dirtyCells[id];
      }
    }
    if (this.props.playing === false) {
      this.props.updateCells(this.dirtyCells);
      this.changed = 0;
      // play MIDI note is song not is playing
      // if(this.props.playing === false) {
      //   const midiEventId = this.props.grid.cells[id].midiEventId;
      //   if (midiEventId !== null) {
      //     console.log(midiEventId);
      //   }
      // }
    }
    e.preventDefault();
  }

  dispatchUpdateWhilePlaying() {
    // perform some caching here in case of dragging / mousmove
    const threshold = 0;// this.hasTouchMoved ? 15 : 0;
    if (this.props.playing && this.changed > threshold) {
      this.props.updateCells(this.dirtyCells);
      this.changed = 0;
      // this.hasTouchMoved = false;
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
      width: `calc((100vw - 0px) / ${numCols})`,
      height: `calc((100vh - 50px) / ${numRows})`,
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
        // add Cell.tsx back in so you can highlight the cells that are hovered / dragged
        rows.push(
          <div
            id={id}
            key={id}
            style={cellStyle}
            // label={id}
            className={classNames.join(' ')}
          />
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
        onTouchStartCapture={this.onCellClick.bind(this)}
        onTouchMoveCapture={this.onCellClick.bind(this)}
        onTouchEndCapture={this.onCellClick.bind(this)}
        onClickCapture={this.onCellClick.bind(this)}
      >
        {columns}
      </div>
    )
  }
}

export default Grid;
