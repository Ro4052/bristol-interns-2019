import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { finishPlayCard } from '../MyCards/MyCardsActions';
import Button from '../shared/Button/Button';

export class EndTurn extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
        this.endTurn = this.endTurn.bind(this);
    }

    endTurn() {
        axios.post('/api/playCardWord', {
            cardId: this.props.playedCardId,
            word: this.props.word
        })
        .then(() => this.props.finishPlayCard(this.props.playedCardId))
        .catch(err => console.log(err));
    }

    render() {
        return (
            <Button cy="end-turn" handleClick={this.endTurn} text="End my turn" />
        );
    }
}

const mapStateToProps = (state) => ({
    word: state.playWordReducer.word,
    playedCardId: state.myCardsReducer.playedCardId
});

const mapDispatchToProps = (dispatch) => ({
    finishPlayCard: (cardId) => dispatch(finishPlayCard(cardId))
});

export default connect(mapStateToProps, mapDispatchToProps)(EndTurn);
