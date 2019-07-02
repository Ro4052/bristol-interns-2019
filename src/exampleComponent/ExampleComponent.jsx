import React from 'react';
import Turn from '../components/Turn/Turn';
import Cookies from 'js-cookie';
import Cards from '../Cards';

class ExampleComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: "Waiting for a button press..."
        }
    }

  componentWillMount() {
    if (!Cookies.get('username')) {
      window.location = '/'
    }
  }

  render() {
    return (
      <>
        <button onClick={this.get}>Get</button>
        <button onClick={this.ping}>Ping</button>
        <div>{this.state.text}</div>
        <Cards/>
        <Turn />
      </>
    )
  }
}

export default ExampleComponent;
