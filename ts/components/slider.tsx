import React from 'react'

interface PropsType {
  max: number,
  min: number,
  value: number
  id?: string,
  label?: string,
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void, // move slider thumb
  onInput: (event: React.FormEvent<HTMLInputElement>) => void, // release slider thumb
  step?: number,
  type?: string,
  disabled: boolean,
};

interface Slider {
  props: PropsType,
};


/* React wrapper for input type Range */
class Slider extends React.PureComponent {
  static defaultProps = {
    step: 1,
  }

  render() {
    let value = this.props.value
    let id = this.props.id || `slider-${Date.now()}`;

    function createLabel(props: PropsType) {
      let label = `${value}`;
      if (props.label) {
        label = props.label + ': <em>' + value + '</em>'
      }
      return { __html: label }
    }

    return (
      <div className="react-slider" id={this.props.id}>
        <label htmlFor={id} dangerouslySetInnerHTML={createLabel(this.props)} />
        <input
          key={this.props.type}
          type="range"
          disabled={this.props.disabled}
          defaultValue={`${value}`}
          min={this.props.min}
          max={this.props.max}
          step={this.props.step}
          onChange={this.props.onChange}
          onTouchEndCapture={this.props.onInput}
          onMouseUpCapture={this.props.onInput}
        />
      </div>
    )
  }
}

export default Slider
