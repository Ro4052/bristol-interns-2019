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
        console.log(id);
        if (this.props.voteCard && id !== this.props.playedCard.toString()) {
            this.props.voteForCard(id);
        }
    }

    getCardClass(id) {
        return (this.props.voteCard && !this.props.votedCard && (id !== this.props.playedCard.toString())) ? styles.allCards : styles.allCardsDisabled;
    }

    render() {
        return (
            <ul id="played-cards">
                {this.props.cards.map(card => <img id={"card-" + card.cardId} key={card.cardId} className={this.getCardClass(card.cardId)} alt={"card-" + card.cardId} src={require(`../cards/card (${card.cardId}).jpg`)} onClick={this.voteForCard.bind(this)}/>)}
            </ul>
        );
    }
}

const mapStateToProps = (state) => {
    return ({
        cards: state.reducer.currentCards,
        voteCard: state.playerReducer.voteCard,
        playedCard: state.playerReducer.playedCard
    });
}

const mapDispatchToProps = (dispatch) => ({
    voteForCard: (id) => dispatch(voteForCard(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(PlayedCards);
