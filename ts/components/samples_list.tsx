import React, { RefObject } from 'react'
import { curry } from 'ramda';

interface PropTypes {
  noteNumbers: Array<number>,
  instrumentNoteNumbers: Array<number>,
  selectNoteNumber: (newValue: number, oldValue: number) => void
  removeRow: (noteNumber: number) => void
  handleFileUpload: (e: React.ChangeEvent, fileType: string) => void
};

interface SamplesList {
  props: PropTypes,
};

class SamplesList extends React.PureComponent {
  fileUploadRef: RefObject<HTMLInputElement>
  boundOnClick: (e: React.FormEvent) => void

  constructor(props: PropTypes) {
    super(props);
    this.fileUploadRef = React.createRef();
    this.boundOnClick = this.onClick.bind(this);
  }

  onClick() {
    if (this.fileUploadRef.current) {
      this.fileUploadRef.current.click();
      this.fileUploadRef.current.value = '';
    }
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
      id="samples-list"
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
        <input 
          type="file"
          onChange={e => { this.props.handleFileUpload(e, 'sample') }}
          multiple={true}
          className="upload-file"
          ref={this.fileUploadRef}
          accept=".wav, .ogg, .mp3"
        />
        <button onClick={this.boundOnClick}>upload sample</button>
        <button onClick={() => { this.props.removeRow(n) }}>remove row</button>
      </div>)}
    </div>;
  }
}

export default SamplesList;