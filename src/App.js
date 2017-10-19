import React, { Component } from 'react';
import './App.css';

import Random from './random';
import Convertor from './convertor';

class Welcome extends Component {

  render() {
    return !this.props.name ?
      <div>Bonjour le monde !</div> :
      <div>Bonjour {this.props.name } !</div>;
  }
}

class App extends Component {

  constructor() {
    super();
    this.state = {
      rendered: true,
      names: [
        'Riri',
        'Fifi',
        'Loulou',
      ]
    }
  }

  // Syntaxe qui bind la methode automatiquement
  toggle = () => {
    this.setState({
      rendered: !this.state.rendered,
    })
  }

  render() {
    return (
      <div>
        <h2>Composant et props</h2>
        <Welcome />
        <Welcome name="Titi" />

        <h2>Composant et state</h2>
        <button onClick={this.toggle}>Toggle</button>
        {this.state.rendered && <Random />}

        <h2>Listes</h2>
        {this.state.names.map((name, i) => {
          return (
            <Welcome
              key={name}
              name={name}
            />
          );
        })}

        <h2>Formulaires</h2>
        <Convertor />

      </div>
    );
  }
}

export default App;
