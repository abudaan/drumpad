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

  checkIfDisabled (index: number, noteNumber: number): boolean {
    return this.props.noteNumbers.indexOf(noteNumber) !== -1 && index !== noteNumber;
  }

  getOptions (index: number): Array<JSX.Element> { 
    const options = this.props.instrumentNoteNumbers.map(n => (
      <option
        key={n}
        value={n}
        disabled={this.checkIfDisabled(index, n)}
      >{n}
      </option>
    ));
    return options;
  }

  render() {
    return <div
      id="samples"
      ref={this.divRef}
    >
      {this.props.noteNumbers.map(n => <div key={n} className="cell">
        <select
          onChange={(e) => {
            const value = parseInt(e.target.options[e.target.selectedIndex].value, 10);
            this.props.selectNoteNumber(value, n);
          }}
          value={`${n}`}
        >
          {this.getOptions(n)}
        </select>
        <button disabled>upload sample</button>
      </div>)}
    </div>;
  }
}

export default SamplesList;