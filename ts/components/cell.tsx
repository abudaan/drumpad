import React, { ChangeEvent, MouseEvent } from 'react'
import { GridCell } from '../interfaces';

interface PropTypes {
  onChange: (event: ChangeEvent) => void,
  onMouseDown?: (event: MouseEvent) => void,
  onMouseUp?: (event: MouseEvent) => void,
  item: GridCell,
  style: Object,
  className: string,
};

interface GridItem {
  props: PropTypes,
};

class GridItem extends React.PureComponent {
  componentDidMount() {
    
  }
  // onMouseEnter={() => { console.log(this.props.item.ticks, this.props.item.noteNumber) }}
  render() {
    return <div
      style={this.props.style}
      className={this.props.className}>
      <span>{`${this.props.item.ticks} ${this.props.item.noteNumber}`}</span>
    </div>;
  }
}

export default GridItem;