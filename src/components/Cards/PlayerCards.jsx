import React from 'react';
import styles from './Cards.module.css';
import { connect } from 'react-redux';
import axios from 'axios';
import { fetchCards, requestPlayCard, finishPlayCard } from '../../store/playerActions';

export class PlayerCards extends React.Component {

    constructor() {
        super();
        this.state = {
            playedCardText: "",
            havePlayed: false
        }
    }

    componentDidMount() {
        this.props.fetchCards();
    }

    componentDidUpdate() {
        if (this.props.playedCard !== 0 && this.props.othersTurn) {
            this.playCardForWord();
        }
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

    playCardForWord() {
        console.log("Playing card for word...");
        axios.post('/api/playCard', {
            card: this.props.playedCard,
        })
        .then(() => {
            this.props.finishPlayCard(this.props.playedCard)
        })
        .catch(err => {
            console.log(err);
        });
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
    playedCard: state.playerReducer.playedCard
});

const mapDispatchToProps = (dispatch) => ({
    fetchCards: () => dispatch(fetchCards()),
    requestPlayCard: (id) => dispatch(requestPlayCard(id)),
    finishPlayCard: (id) => dispatch(finishPlayCard(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(PlayerCards);