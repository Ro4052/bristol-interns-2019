import React from 'react';
import { connect } from 'react-redux';
import { voteForCard } from './PlayedCardsActions';
import { CardList } from '../shared/CardList/CardList';

export class PlayedCards extends React.Component {
    
    constructor(props) {
        super(props);
        this.getVotesForCard = this.getVotesForCard.bind(this);
        this.isEnabled = this.isEnabled.bind(this);
    }

    getVotesForCard(card) {
        return this.props.votes.reduce((sum, vote) => sum + (vote.cardId === card.cardId), 0);
    }

    isEnabled(cardId) {
        return this.props.voteCard && (cardId !== this.props.playedCardId);
    }

    render() {
        const cards = (this.props.status === 'DISPLAY_ALL_VOTES') ? this.props.cards.map(card => ({...card, votes: this.getVotesForCard(card)})) : this.props.cards;
        const hidden = !(this.props.status === 'DISPLAY_ALL_VOTES' || this.props.status === 'WAITING_FOR_VOTES');
        return (
            <CardList cards={cards} handleClick={this.props.voteForCard} hidden={hidden} isEnabled={this.isEnabled} cy="played-cards" />
        );
    }
}

const mapStateToProps = (state) => ({
    cards: state.playedCardsReducer.cards,
    hidden: state.playedCardsReducer.hidden,
    voteCard: state.playedCardsReducer.voteCard,
    playedCardId: state.myCardsReducer.playedCardId,
    votes: state.playedCardsReducer.votes,
    status: state.dashboardReducer.status
});

const mapDispatchToProps = (dispatch) => ({
    voteForCard: (cardId) => dispatch(voteForCard(cardId))
});

export default connect(mapStateToProps, mapDispatchToProps)(PlayedCards);
