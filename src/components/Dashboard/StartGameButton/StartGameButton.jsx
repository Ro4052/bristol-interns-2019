import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';

export class StartGameButton extends React.Component {

    startGame() {
        axios.get('/api/start')
        .catch(err => {
            console.log(err);
        });
    }

    render() {
        return (
            <button id="start-game" data-cy="start-game" onClick={this.startGame}>Start game</button>
        );
    }
}

const mapStateToProps = (state) => {
    return ({
//         status: state.gameReducer.status,
    });
}

const mapDispatchToProps = (dispatch) => ({
//     finishPlayCard: (id) => dispatch(finishPlayCard(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(StartGameButton);
