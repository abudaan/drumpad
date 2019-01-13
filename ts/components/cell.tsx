import React, { MouseEvent, RefObject, SyntheticEvent } from 'react'
import { GridCellData } from '../interfaces';

interface PropTypes {
  onChange: (selectedCells: Array<{ ticks: number, noteNumber: number, selected: boolean }>) => void,
  onMouseOver: (Event: SyntheticEvent) => void
  item: GridCellData,
  style: Object,
  className: string,
  dragActive: boolean,
};

interface GridCell {
  props: PropTypes,
};

class GridCell extends React.PureComponent {
  divRef: RefObject<HTMLDivElement>
  cells: Array<{ ticks: number, noteNumber: number }>

  constructor(props: PropTypes) {
    super(props);
    this.cells = [];
    this.divRef = React.createRef();
  }

  updateCell(ticks: number, noteNumber: number) {
    const div = this.divRef.current;
    if (div !== null) {
      if (div.className.indexOf('selected') !== -1) {
        div.className = 'cell';
      } else {
        div.className = 'cell selected';
      }
    }
  }

  updateCells(ticks: number, noteNumber: number) {
    if (this.props.dragActive !== true) {
      return;
    }
    const div = this.divRef.current;
    if (div !== null) {
      if (div.className.indexOf('drag') === -1) {
        if (div.className.indexOf('selected') !== -1) {
          div.className = 'cell selected drag';
        } else {
          div.className = 'cell drag';
        }
      } else if (div.className.indexOf('drag') !== -1) {
        if (div.className.indexOf('selected') !== -1) {
          div.className = 'cell selected';
        } else {
          div.className = 'cell';
        }
      }
    }
  }

  render() {
    console.log('render cell')
    return <div
      ref={this.divRef}
      // onMouseEnter={() => {
      //   this.updateCells(this.props.item.ticks, this.props.item.noteNumber);
      // }}
      // onClick={(e) => {
      //   this.updateCell(this.props.item.ticks, this.props.item.noteNumber)
      // }}
      onMouseOver={this.props.onMouseOver}
      style={this.props.style}
      className={this.props.className}
      id={`${this.props.item.ticks}-${this.props.item.noteNumber}`}
    >
      <span>{`${this.props.item.ticks} ${this.props.item.noteNumber}`}</span>
    </div>;
  }
}

export default GridCell;