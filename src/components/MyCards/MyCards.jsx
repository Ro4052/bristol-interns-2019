import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { fetchCards, requestPlayCard, finishPlayCard } from '../../store/playerActions';
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
        if (this.props.playWordAndCard) {
            this.props.requestPlayCard(cardId);
        } else if (this.props.playCard) {
            this.props.requestPlayCard(cardId);
            this.playCardForWord(cardId);
        }
    }

    playCardForWord(cardId) {
        axios.post('/api/playCard', { cardId })
        .then(() => this.props.finishPlayCard(this.props.playedCard))
        .catch(err => console.log(err));
    }

    isEnabled() {
        return (this.props.playWordAndCard || this.props.playCard) && this.props.playedCard === 0;
    }

    render() {
        return (
            <div className={styles.myCards}>
                <CardList cards={this.props.myCards} handleClick={this.playCard} isEnabled={this.isEnabled} cy={"my-cards"} />
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    playWordAndCard: state.playerReducer.playWordAndCard,
    playCard: state.playerReducer.playCard,
    myCards: state.playerReducer.myCards,
    playedCard: state.playerReducer.playedCard
});

const mapDispatchToProps = (dispatch) => ({
    fetchCards: () => dispatch(fetchCards()),
    requestPlayCard: (cardId) => dispatch(requestPlayCard(cardId)),
    finishPlayCard: (cardId) => dispatch(finishPlayCard(cardId))
});

export default connect(mapStateToProps, mapDispatchToProps)(MyCards);
