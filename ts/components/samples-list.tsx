import React, { RefObject, SyntheticEvent } from 'react'

interface PropTypes {
  noteNumbers: Array<string>,
};

interface SamplesList {
  props: PropTypes,
};

class SamplesList extends React.PureComponent {
  divRef: RefObject<HTMLDivElement>

  constructor(props: PropTypes) {
    super(props);
    this.divRef = React.createRef();
  }

  render() {
    return <div
      id="samples"
      ref={this.divRef}
    >
    {this.props.noteNumbers.map(n => <div key={n} className="cell">{n}</div>)}
    </div>;
  }
}

export default SamplesList;