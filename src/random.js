import React from 'react';


const random = () => Math.round(Math.random() * 10);

export default class Random extends React.Component {

  constructor(props) {
    super(props);

    // etat interne du composant
    this.state = {
      number: random(),
    };

  }

  componentDidMount() {
    this.timer = setInterval(this.update.bind(this), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  update() {
    this.setState({ number: random() });
  }

  render () {
    return (
      <div>
        Nombre aléatoire : {this.state.number}
      </div>
    )
  }
}
