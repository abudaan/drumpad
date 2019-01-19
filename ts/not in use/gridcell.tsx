import React, { RefObject, SyntheticEvent } from 'react'

interface PropTypes {
  id: string,
  style: Object,
  label: string,
  className: string,
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

  setHighlight(flag: boolean) {
    const div = this.divRef.current;
    if (div !== null) {
      const classNames = div.className.split(' ');
      if (flag) {
        classNames.push('highlight');
        div.className = classNames.join(' ')
      } else {
        const i = classNames.indexOf('hightlight');
        div.className = classNames.slice(i, 1).join(' ')
      }
    }
  }

  render() {
    return <div
      id={this.props.id}
      ref={this.divRef}
      onTouchStart={() => { this.setHighlight(true) }}
      onTouchEnd={() => { this.setHighlight(false) }}
      style={this.props.style}
      className={this.props.className}
    >
      <span>{this.props.label}</span>
    </div>;
  }
}

export default GridCell;