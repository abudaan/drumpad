import React, { MouseEvent, RefObject, SyntheticEvent } from 'react'
import { GridCellData } from '../interfaces';

interface PropTypes {
  addDirtyCell: (cell: GridCellData) => void
  item: GridCellData,
  style: Object,
  className: string,
};

interface GridCell {
  props: PropTypes,
};

class GridCell extends React.PureComponent {
  constructor(props: PropTypes) {
    super(props);
  }

  dispatchUpdate() {
    const {
      selected,
    } = this.props.item;
    this.props.addDirtyCell({
      ...this.props.item,
      selected: !selected,
    });
  }

  render() {
    return <div
      onMouseDown={this.dispatchUpdate.bind(this)}
      onTouchEnd={this.dispatchUpdate.bind(this)}
      style={this.props.style}
      className={this.props.className}
      id={`${this.props.item.ticks}-${this.props.item.noteNumber}`}
    >
      <span>{`${this.props.item.ticks} ${this.props.item.noteNumber}`}</span>
    </div>;
  }
}

export default GridCell;