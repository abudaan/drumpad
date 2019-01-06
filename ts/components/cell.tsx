import React, { ChangeEvent, MouseEvent } from 'react'
import { GridItem } from '../interfaces';

interface PropTypes {
  onChange: (event: ChangeEvent) => void,
  onMouseDown?: (event: MouseEvent) => void,
  onMouseUp?: (event: MouseEvent) => void,
  item: GridItem,
  style: Object,
  className: string,
};

interface Cell {
  props: PropTypes,
};

class Cell extends React.PureComponent {
  render() {
    return <div
      style={this.props.style}
      className={this.props.className}>
      <span>{`${this.props.item.ticks} ${this.props.item.noteNumber}`}</span>
    </div>;
  }
}

export default Cell;