import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { fetchCards, selectCard } from './MyCardsActions';
import { finishPlayCard } from './MyCardsActions';
import CardList from '../shared/CardList/CardList';
import styles from './MyCards.module.css';

export class MyCards extends React.Component {

    constructor() {
        super();
        this.state = {};
        this.playCard = this.playCard.bind(this);
        this.playCardForWord = this.playCardForWord.bind(this);
        this.isEnabled = this.isEnabled.bind(this);
    }

    componentDidMount() {
        this.props.fetchCards();
    }

    playCard(cardId) {
        if (this.props.playCard) {
            this.props.selectCard(cardId);
            // this.playCardForWord(cardId);
        }
    }

    playCardForWord(cardId) {
        axios.post('/api/playCard', { cardId })
        .then(() => this.props.finishPlayCard(this.props.playedCardId))
        .catch(err => console.log(err));
    }

    isEnabled() {
        return this.props.playCard && !this.props.playedCardId;
    }

    render() {
        return (
            <div className={styles.myCards}>
                <CardList cards={this.props.cards} handleClick={this.playCard} isEnabled={this.isEnabled} cy={"my-cards"} />
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    playCard: state.myCardsReducer.playCard,
    cards: state.myCardsReducer.cards,
    playedCardId: state.myCardsReducer.playedCardId
});

const mapDispatchToProps = (dispatch) => ({
    fetchCards: () => dispatch(fetchCards()),
    selectCard: (cardId) => dispatch(selectCard(cardId)),
    finishPlayCard: (cardId) => dispatch(finishPlayCard(cardId))
});

export default connect(mapStateToProps, mapDispatchToProps)(MyCards);
