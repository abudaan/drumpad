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
    console.log('render cell')
    return <div
      ref={this.divRef}
      onMouseEnter={this.updateCell.bind(this)}
      onMouseDown={this.updateCell.bind(this)}
      style={this.props.style}
      className={this.props.className}
      id={`${this.props.item.ticks}-${this.props.item.noteNumber}`}
    >
      <span>{`${this.props.item.ticks} ${this.props.item.noteNumber}`}</span>
    </div>;
  }
}

export default GridCell;