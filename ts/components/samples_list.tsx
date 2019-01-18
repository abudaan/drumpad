import React, { RefObject, SyntheticEvent } from 'react'

interface PropTypes {
  noteNumbers: Array<number>,
  instrumentNoteNumbers: Array<number>,
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

  checkIfDisabled (n: number): boolean {
    this.props.noteNumbers.findIndex() === -1
    return false;
  }

  render() {
    const options = this.props.instrumentNoteNumbers.map(n => (
      <option
        key={n}
        value={n}
        disabled={this.checkIfDisabled(n)}
      >{n}
      </option>
    ));
    return <div
      id="samples"
      ref={this.divRef}
    >
      {this.props.noteNumbers.map(n => <div key={n} className="cell">
        {/* {n} */}
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