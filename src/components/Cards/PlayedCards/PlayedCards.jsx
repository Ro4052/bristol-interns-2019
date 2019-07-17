import React from 'react';
import { connect } from 'react-redux';
import { voteForCard } from '../../../store/playerActions';
import { Card } from '../../shared/Card/Card';

export class PlayedCards extends React.Component {
    constructor(props) {
        super(props);
        this.voteForCard = this.voteForCard.bind(this);
        this.getVotesForCard = this.getVotesForCard.bind(this);
    }

    voteForCard(cardId) {
        if (this.props.voteCard && (cardId !== this.props.playedCard)) {
            this.props.voteForCard(cardId);
        }
    }

    getVotesForCard(card) {
        return this.props.allVotes.reduce((sum, vote) => sum + (vote.cardId === card.cardId), 0)
    }

    render() {
        return (
            <ul cardId="played-cards" data-cy="played-cards">
                {this.props.cards.map(card => 
                    <li key={card.cardId}>
                        <Card card={card} handleClick={this.voteForCard} enabled={this.props.voteCard && (card.cardId !== this.props.playedCard)} />
                        {this.props.allVotes && this.props.status === 'DISPLAY_ALL_VOTES' && <span data-cy='votes'>{this.getVotesForCard(card)}</span>}
                    </li>
                )}
            </ul>
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
