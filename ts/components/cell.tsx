import React, { MouseEvent, RefObject, SyntheticEvent } from 'react'
import { GridCellData } from '../interfaces';

interface PropTypes {
  addDirtyCell: (div: HTMLDivElement) => void
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

  constructor(props: PropTypes) {
    super(props);
    this.divRef = React.createRef();
  }

  updateCell() {
    if (this.props.dragActive !== true) {
      return;
    }
    const div = this.divRef.current;
    if (div !== null) {
      if (div.className.indexOf('selected') !== -1) {
        div.className = 'cell';
      } else {
        div.className = 'cell selected';
      }
      this.props.addDirtyCell(div);
    }
  }

  render() {
    // console.log('render cell')
    const div = this.divRef.current ? this.divRef.current : null;
    return <div
      ref={this.divRef}
      // onMouseOver={this.updateCell.bind(this)}
      // onMouseDown={this.updateCell.bind(this)}
      onMouseDown={() => {
        if (div !== null) {
          this.props.addDirtyCell(div);
        }
      }}
      onTouchStartCapture={(e: SyntheticEvent) => {
        // e.preventDefault()
        if (this.divRef.current !== null) {
          // this.props.addDirtyCell(div);
          if (this.divRef.current.className.indexOf('selected') !== -1) {
            this.divRef.current.className = 'cell';
          } else {
            this.divRef.current.className = 'cell selected';
          }
        }
        return false;
      }}
      // onTouchEnd={e => {e.preventDefault();}}
      style={this.props.style}
      className={this.props.className}
      id={`${this.props.item.ticks}-${this.props.item.noteNumber}`}
    >
      <span>{`${this.props.item.ticks} ${this.props.item.noteNumber}`}</span>
    </div>;
  }
}

export default GridCell;