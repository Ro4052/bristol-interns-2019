import React from 'react';
import Cookies from 'js-cookie';
import Cards from '../Cards';
import socket from '../socket';

class ExampleComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "Waiting for a button press..."
    }
    this.get = this.get.bind(this);
    this.ping = this.ping.bind(this);
  }

  componentWillMount() {
    if (!Cookies.get('username')) {
      window.location = '/'
    }
  }
  componentDidMount() {
    // const wsProtocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
    // this.socket = new WebSocket(`${wsProtocol}://${window.location.host}/socket`);
    // this.socket.onmessage = message => {
    //   console.log(message);
    //   this.setState({ text: message.data });
    // }

  }

  get() {
    // axios.get('/api/hello')
    //   .then(response => {
    //     console.log(response);
    //     this.setState({
    //       text: response.data.join(' ')
    //     });
    //   });
  }

  ping() {
    // this.socket.send("ping");
  }

  render() {
    return (
      <>
        <button onClick={this.get}>Get</button>
        <button onClick={this.ping}>Ping</button>
        <div>{this.state.text}</div>
        <Cards/>
      </>
    )
  }
}

export default ExampleComponent;
