import React from 'react';
import { connect } from 'react-redux';
import { voteForCard } from './PlayedCardsActions';
import CardList from '../shared/CardList/CardList';

export class PlayedCards extends React.Component {
    
    constructor(props) {
        super(props);
        this.isEnabled = this.isEnabled.bind(this);
    }

    isEnabled(cardId) {
        return this.props.voteCard && (cardId !== this.props.playedCardId);
    }

    render() {
        return (
            <CardList cards={this.props.cards} handleClick={this.props.voteForCard} isEnabled={this.isEnabled} cy="played-cards" />
        );
    }
}

const mapStateToProps = state => ({
    cards: state.playedCardsReducer.cards,
    voteCard: state.playedCardsReducer.voteCard,
    playedCardId: state.myCardsReducer.playedCardId,
    votes: state.playedCardsReducer.votes
});

const mapDispatchToProps = dispatch => ({
    voteForCard: cardId => dispatch(voteForCard(cardId))
});

export default connect(mapStateToProps, mapDispatchToProps)(PlayedCards);
