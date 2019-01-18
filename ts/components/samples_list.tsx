import React, { RefObject, SyntheticEvent } from 'react'

interface PropTypes {
  noteNumbers: Array<number>,
  instrumentSamplesList: Array<any>,
  selectNoteNumber: (newValue: number, oldValue: number) => void
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
    const options = this.props.instrumentSamplesList.map(o => (<option key={o[0]} value={o[0]}>{o[0]}</option>));
    return <div
      id="samples"
      ref={this.divRef}
    >
      {this.props.noteNumbers.map(n => <div key={n} className="cell">
        {n}
        <select
          onChange={(e) => { 
            const value = parseInt(e.target.options[e.target.selectedIndex].value, 10);
            this.props.selectNoteNumber(value, n);
          }}
          value={`${n}`}
          // defaultValue={`${n}`}
        >
          {options}
        </select>
      </div>)}
    </div>;
  }
}

export default SamplesList;