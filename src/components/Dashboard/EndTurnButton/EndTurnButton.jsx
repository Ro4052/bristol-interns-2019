import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { finishPlayCard } from '../../../store/playerActions';

export class EndTurnButton extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
        this.endTurn = this.endTurn.bind(this);
    }

    endTurn() {
        if (this.props.myWord && this.props.playedCard) {
            axios.post('/api/playCardWord', {
                card: this.props.playedCard,
                word: this.props.myWord
            })
            .then(() => {
                this.props.finishPlayCard(this.props.playedCard);
            })
            .catch(err => {
                console.log(err);
            });
        }
    }

    render() {
        return (
            <button id="end-turn" onClick={this.endTurn} data-cy='end-turn'>End my turn</button>
        );
    }
}

const mapStateToProps = (state) => ({
    myWord: state.playerReducer.myWord,
    playedCard: state.playerReducer.playedCard
});

const mapDispatchToProps = (dispatch) => ({
    finishPlayCard: (id) => dispatch(finishPlayCard(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(EndTurnButton);
