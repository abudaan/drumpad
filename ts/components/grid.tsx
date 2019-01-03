import React, { ChangeEvent, MouseEvent } from 'react'

interface PropTypes {
  onChange: (event: ChangeEvent) => void,
  onMouseDown?: (event: MouseEvent) => void,
  onMouseUp?: (event: MouseEvent) => void,
  rows: number,
  columns: number,
  disabled: boolean,
};

interface Grid {
  props: PropTypes,
};


class Grid extends React.Component{
  static defaultProps = {
    rows: 4,
    columns: 5,
  }
  render(){
    const cellStyle = {
      width: `calc(100vh - 110px) / ${this.props.columns})`,
      height: `calc((100vh - 110px) / ${this.props.rows})`, 
    };

    const rows = [];
    for (let i = 0; i < this.props.rows; i++) {
      const columns = [];
      for (let j = 0; j < this.props.columns; j++) {
        columns.push(
          <div key={`column${j}`} style={cellStyle} className="cell"><span>{`cell ${i}-${j}`}</span></div>
        );
      }
      rows.push(
        <div key={`row${i}`} className="row">{columns}</div>
      )
    }
    return (
      <div id="grid">
        {rows}
      </div>
    )
  }
}

export default Grid;
