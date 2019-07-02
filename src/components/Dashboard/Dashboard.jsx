import React from 'react';
import Turn from '../Turn/Turn';
import Cards from '../Cards/Cards';
import Message from '../Message/Message';

class Dashboard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            text: "Waiting for a button press..."
        }
    }

    render() {
        return (
            <>
                <div>{this.state.text}</div>
                <Cards/>
                <Turn />
                <Message />
            </>
        )
    }
}

export default Dashboard;
