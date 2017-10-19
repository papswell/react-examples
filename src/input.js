import React from 'react';

export default class Amount extends React.Component {

  constructor(props) {
    super(props);
  }

  handleChange = (event) => {
    const newValue = event.target.value;
    this.props.onInputChange(newValue, this.props.currency);
  }

  render() {
    return (
      <div className="input">
        <input
          value={this.props.inputValue}
          onChange={this.handleChange}
        />
        <span className="currency">
          {this.props.currency}
        </span>
      </div>
    );
  }
}
