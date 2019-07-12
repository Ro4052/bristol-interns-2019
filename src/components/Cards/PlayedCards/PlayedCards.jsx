import React from 'react';
import { connect } from 'react-redux';
import { voteForCard } from '../../../store/playerActions'
import styles from '../Cards.module.css';

export class PlayedCards extends React.Component {
    constructor(props) {
        super(props);
        this.voteForCard = this.voteForCard.bind(this);
    }

    voteForCard(event) {
        const id = event.target.id.split('-')[1];
        if (this.props.voteCard && id !== this.props.playedCard.toString()) {
            this.props.voteForCard(id);
        }
    }

    getCardClass(id) {
        return (this.props.voteCard && (this.props.votedCard === 0) && (id !== this.props.playedCard.toString())) ? styles.allCards : styles.allCardsDisabled;
    }

    getVotesForCard(id) {
        let votes = 0;
        this.props.allVotes.map((vote) => votes += (id === vote.cardId));
        return votes;
    }

    render() {
        return (
            <ul id="played-cards" styles={styles.playedCards} data-cy="played-cards">
                {this.props.cards.map(card => 
                    <li className={styles.playedCard} key={card.cardId}>
                        {(this.props.allVotes && this.props.status === 'DISPLAY_ALL_VOTES') && <span data-cy='votes'>{this.getVotesForCard(card.cardId)}</span>}
                        <img id={"card-" + card.cardId} className={this.getCardClass(card.cardId)} alt={"card-" + card.cardId}
                         src={require(`../cards/card (${card.cardId}).jpg`)} onClick={this.voteForCard}/>
                    </li>
                )}
            </ul>
        );
    }
}

const mapStateToProps = (state) => {
    return ({
        cards: state.gameReducer.currentCards,
        voteCard: state.playerReducer.voteCard,
        votedCard: state.playerReducer.votedCard,
        playedCard: state.playerReducer.playedCard,
        allVotes: state.gameReducer.allVotes,
        status: state.gameReducer.status
    });
}

const mapDispatchToProps = (dispatch) => ({
    voteForCard: (id) => dispatch(voteForCard(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(PlayedCards);
