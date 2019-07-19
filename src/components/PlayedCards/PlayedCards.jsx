import React from 'react';
import { connect } from 'react-redux';
import { voteForCard } from '../../store/playerActions';
import { CardList } from '../shared/CardList/CardList';
import { styles } from 'ansi-colors';

export class PlayedCards extends React.Component {
    
    constructor(props) {
        super(props);
        this.getVotesForCard = this.getVotesForCard.bind(this);
        this.isEnabled = this.isEnabled.bind(this);
    }

    getVotesForCard(card) {
        return this.props.allVotes.reduce((sum, vote) => sum + (vote.cardId === card.cardId), 0)
    }

    isEnabled(cardId) {
        return this.props.voteCard && (cardId !== this.props.playedCard);
    }

    render() {
        const cards = this.props.cards.map(card => ({...card, votes: this.getVotesForCard(card)}));
        return (
            <CardList cards={this.props.status === 'DISPLAY_ALL_VOTES' ? cards : this.props.cards} handleClick={this.props.voteForCard} isEnabled={this.isEnabled} cy="played-cards" />
        );
    }
}

const mapStateToProps = (state) => ({
    cards: state.gameReducer.currentCards,
    voteCard: state.playerReducer.voteCard,
    playedCard: state.playerReducer.playedCard,
    allVotes: state.gameReducer.allVotes,
    status: state.gameReducer.status
});

const mapDispatchToProps = (dispatch) => ({
    voteForCard: (cardId) => dispatch(voteForCard(cardId))
});

export default connect(mapStateToProps, mapDispatchToProps)(PlayedCards);
