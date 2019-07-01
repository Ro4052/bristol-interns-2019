import React from 'react';
import axios from 'axios';

class ChooseCard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    endTurn() {
        console.log("endTurn");
        axios.get('/api/endTurn')
        .then(response => {
            console.log(response);
        })
        .catch(err => {
            console.log(err);
        })
    }

    render() {
        return (
            <div>
                Choose card
                <button onClick={this.endTurn}>End turn</button>
            </div>
        )
    }
}

export default ChooseCard;
