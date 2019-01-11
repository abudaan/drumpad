import React, { MouseEvent, RefObject, SyntheticEvent } from 'react'
import { GridCellData } from '../interfaces';

interface PropTypes {
  addDirtyCell: (cell: GridCellData) => void
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

  render() {
    return <div
      ref={this.divRef}
      // onMouseOver={this.updateCell.bind(this)}
      // onMouseDown={this.updateCell.bind(this)}
      onMouseDown={() => {
          const {
            selected,
          } = this.props.item;
          this.props.addDirtyCell({
            ...this.props.item,
            selected: !selected,
          });
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