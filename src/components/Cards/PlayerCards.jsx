import React from 'react';
import styles from './Cards.module.css';
import { connect } from 'react-redux';
import axios from 'axios';
import { fetchCards, requestPlayCard, finishPlayCard } from '../../store/playerActions';

export class PlayerCards extends React.Component {

    constructor() {
        super();
        this.state = {
            playedCardText: ""
        }
    }

    componentDidMount() {
        this.props.fetchCards();
    }
    
    getPlayerCards() {
        let cardImages = [];
        if (this.props.myCards) {
            for (let i = 0; i < this.props.myCards.length; i++) {
                let index = this.props.myCards[i]
                cardImages.push({
                    url: require(`./cards/card (${index}).jpg`),
                    id: index
                });
            }
        }
        return cardImages;
    }

    playCard(card) {
        if (this.props.playWordAndCard) {
            this.props.requestPlayCard(card.target.id.split('-')[1]);
        } else if (this.props.playCard) {
            this.props.requestPlayCard(card.target.id.split('-')[1]);
        }
    }

    playCardForWord(card) {
        var id = card.target.id.split('-')[1];
        if (this.props.myTurn) {
            this.props.requestPlayCard(id);
        } else if (this.props.othersTurn) {
            this.props.requestPlayCard(id);
            this.playCardForWord(id);
        }
    }

    disableOnEndTurn() {
        return ((this.props.playWordAndCard || this.props.playCard) && this.props.playedCard !== 0) ? styles.singleCard : styles.disabledCard
    }

    render() {
        console.log("playWordAndCard", this.props.playWordAndCard);
        console.log("playedCard", this.props.playedCard);
        const cardsImages = this.getPlayerCards().map((card) => (
            <img id={"card-" + card.id} alt='' className={this.disableOnEndTurn()} key={card.id} src={card.url} onClick={this.playCard.bind(this)}/>
        ))
        return (
            <div className={styles.cardsContainer} id="my-cards">
                <h2>{this.state.playedCardText}</h2>
                <ul>
                    {cardsImages}
                </ul>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    playWordAndCard: state.playerReducer.playWordAndCard,
    playCard: state.playerReducer.playCard,
    othersTurn: state.playerReducer.othersTurn,
    myCards: state.playerReducer.myCards,
    playedCard: state.playerReducer.playedCard,
    myTurn: state.playerReducer.myTurn,
    finishedRound: state.playerReducer.finishedRound
});

const mapDispatchToProps = (dispatch) => ({
    fetchCards: () => dispatch(fetchCards()),
    requestPlayCard: (id) => dispatch(requestPlayCard(id)),
    finishPlayCard: (id) => dispatch(finishPlayCard(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(PlayerCards);