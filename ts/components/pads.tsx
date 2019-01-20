import React, { SyntheticEvent } from 'react';
import { GridType, GridSelectedPads } from '../interfaces';

interface PropTypes {
  update: (cells: GridSelectedPads) => void,
  playSampleFromPad: (id: string, type: number) => void,
  grid: GridType,
  activeColumn: number,
  enabled: boolean,
  playing: boolean,
};

interface Pads {
  props: PropTypes,
};

class Pads extends React.PureComponent {
  dirtyCells: GridSelectedPads
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
    let id = null;
    let event: null | TouchEvent | MouseEvent = null;
    // console.log(e.type);
    if (e.type === 'touchstart') {
      this.hasTouchMoved = false;
    } else if (e.type === 'touchmove') {
      this.hasTouchMoved = true;
      event = e as TouchEvent;
      for (let i = 0; i < event.touches.length; i++) {
        const touch = event.touches[i];
        id = this.getCellId(touch);
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
      event = e as TouchEvent;
      for (let i = 0; i < event.changedTouches.length; i++) {
        const touch = event.changedTouches[i];
        id = this.getCellId(touch);
        if (id !== null) {
          this.changed++;
          this.dirtyCells[id] = !this.dirtyCells[id];
        }
      }
    } else if (e.type === 'mousedown') {
      event = e as MouseEvent
      id = this.getCellId(event);
      if (id !== null) {
        this.changed++;
        this.dirtyCells[id] = !this.dirtyCells[id];
      }
    } else if (e.type === 'mouseup') {
      event = e as MouseEvent
      id = this.getCellId(event);
    }
    if (this.props.playing === false) {
      this.props.update(this.dirtyCells);
      this.changed = 0;
    }
    if (event !== null && id !== null && this.dirtyCells[id] === true) {
      if (event.type === 'mousedown' || event.type === 'touchend') {
        this.props.playSampleFromPad(id, 144);
      } else {
        this.props.playSampleFromPad(id, 128);
      }
    }
    e.preventDefault();
  }

  dispatchUpdateWhilePlaying() {
    // perform some caching here in case of dragging / mousmove
    const threshold = 0;// this.hasTouchMoved ? 15 : 0;
    if (this.props.playing && this.changed > threshold) {
      this.props.update(this.dirtyCells);
      this.changed = 0;
      // this.hasTouchMoved = false;
    }
    requestAnimationFrame(this.dispatchUpdateWhilePlaying.bind(this));
  }

  dispatchUpdate() {
    if (this.props.playing === false) {
      this.props.update(this.dirtyCells);
    }
  }

  render() {
    const numCols = this.props.grid.numCols;
    const numRows = this.props.grid.numRows;
    const columns = [];
    let i = 0;
    for (let c = 0; c < numCols; c++) {
      const rows = [];
      const active = c === this.props.activeColumn;
      for (let r = 0; r < numRows; r++) {
        const classNames = ['cell'];
        const id: string = `${r}-${c}`;
        this.dirtyCells[id] = false;
        if (this.props.grid.selected[id] === true) {
          classNames.push('selected');
          this.dirtyCells[id] = true;
        }

        // add Cell.tsx back in so you can highlight the cells that are hovered / dragged
        rows.push(
          <div
            id={id}
            key={id}
            // label={id}
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
        id="pads"
        onTouchStartCapture={this.onCellClick.bind(this)}
        onTouchMoveCapture={this.onCellClick.bind(this)}
        onTouchEndCapture={this.onCellClick.bind(this)}
        onMouseDownCapture={this.onCellClick.bind(this)}
        onMouseUpCapture={this.onCellClick.bind(this)}
      >
        {columns}
      </div>
    )
  }
}

export default Pads;
