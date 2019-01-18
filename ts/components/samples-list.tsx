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
    </div>;
  }
}

export default SamplesList;