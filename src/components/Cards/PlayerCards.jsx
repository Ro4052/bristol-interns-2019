import React from 'react';
import styles from './Cards.module.css';
import { connect } from 'react-redux';
import axios from 'axios';
import { fetchCards, requestPlayCard } from '../../store/playerActions';

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
        if (this.props.myTurn) {
            this.props.requestPlayCard(card.target.id.split('-')[1]);
        }
        if (this.props.othersTurn) {
            this.props.requestPlayCard(card.target.id.split('-')[1]);
            this.playCardForWord();
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
        return ((this.props.myTurn || this.props.othersTurn) && this.props.playedCard === 0) ? styles.singleCard : styles.disabledCard
    }
    render() {
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

const mapStateToProps = (state) => {
    return ({
        myTurn: state.playerReducer.myTurn,
        othersTurn: state.playerReducer.othersTurn,
        myCards: state.playerReducer.myCards,
        playedCard: state.playerReducer.playedCard
    });
};

const mapDispatchToProps = (dispatch) => ({
    fetchCards: () => dispatch(fetchCards()),
    requestPlayCard: (id) => dispatch(requestPlayCard(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PlayerCards);