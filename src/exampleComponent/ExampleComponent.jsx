import React from 'react';
import Turn from '../components/Turn/Turn';

class ExampleComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: "Waiting for a button press..."
        }
    }

    render() {
        return (
            <>
                <button onClick={this.get}>Get</button>
                <button onClick={this.ping}>Ping</button>
                <div>{this.state.text}</div>
                <Turn />
            </>
        )
    }
}

export default ExampleComponent;
