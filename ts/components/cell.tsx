import React, { ChangeEvent, MouseEvent } from 'react'

interface PropTypes {
  onChange: (event: ChangeEvent) => void,
  onMouseDown?: (event: MouseEvent) => void,
  onMouseUp?: (event: MouseEvent) => void,
  ticks: number,
  noteNumber: number,
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
      <span>{`${this.props.ticks} ${this.props.noteNumber}`}</span>
    </div>;
  }
}

export default Cell;