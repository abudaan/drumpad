import React, { SyntheticEvent } from 'react';
import { GridType, GridSelectedCells } from '../interfaces';

interface PropTypes {
  updateCells: (cells: GridSelectedCells) => void,
  os: string,
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

  constructor(props: PropTypes) {
    super(props);
    this.dirtyCells = {};
    this.lastCellIds = [];
    this.hasTouchMoved = false;
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
          this.dirtyCells[id] = !this.dirtyCells[id];
        }
      }
    } else if (e.type === 'click') {
      const event = e as MouseEvent
      const id = this.getCellId(event);
      if (id !== null) {
        this.dirtyCells[id] = !this.dirtyCells[id];
      }
    }
    if (this.props.playing === false) {
      this.props.updateCells(this.dirtyCells);
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
        // add Cell.tsx back in so you can highlight the cells that are hovered / dragged
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
