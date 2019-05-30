import React from 'react';
import axios from 'axios'; // Alternative to fetch/XMLHttp

class ExampleComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "Waiting for a button press..."
    }

    this.get = this.get.bind(this);
  }

  get() {
    axios.get('/api/hello')
      .then(response => {
        console.log(response);
        this.setState({
          text: response.data.join(' ')
        });
      });
  }

  render() {
    return (
      <>
        <button onClick={this.get}>Get</button>
        <div>{this.state.text}</div>
      </>
    )
  }
}

export default ExampleComponent;
