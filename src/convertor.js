import React, { Component } from 'react';
import Amount from './input';

class Convertor extends Component {

  constructor() {
    super();
    this.state = {

    };
  }

  handleInputChange = (newValue, currency) => {
    console.log('Convertor handle input change', newValue, currency);
  }

  render() {
    return (
      <div className="convertor">
        <div>
          Un super Convertiseur
        </div>
        <Amount
          inputValue={42}
          currency="€"
          onInputChange={this.handleInputChange}
        />
        <Amount
          inputValue={42}
          currency="$"
          onInputChange={this.handleInputChange}
        />
      </div>
    );
  }

}

export default Convertor;
