import React from 'react';
import styles from './Cards.module.css';
import socket from '../../socket';
import { connect } from 'react-redux';
import { fetchCards, playCard } from './cardsActions';

export class PlayerCards extends React.Component {
    constructor() {
        super();
        this.state = {
            cardImages: [],
            playedCardText: ""
        }
    }
    componentDidMount() {
        this.props.fetchCards();
    }
    getPlayerCards() {
        let cardImages = [];
        if (this.props.cards) {
            for (let i = 0; i < this.props.cards.length; i++) {
                let index = this.props.cards[i]
                cardImages.push({
                    url: require(`./cards/card (${index}).jpg`),
                    id: index
                });
            }
        }
        return cardImages;
    }
    playCard(card) {
        socket.emit("play card", card.target.id)
        this.props.playCard(card.target.id.split('-')[1]);
    }
    disableOnEndTurn() {
        return (this.props.myTurn) ? styles.singleCard : styles.disabledCard
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
    console.log(state);
    
    return ({
        myTurn: state.reducer.gameState.myTurn,
        cards: state.cardReducer.cards
    });
};

const mapDispatchToProps = (dispatch) => ({
    fetchCards: () => dispatch(fetchCards()),
    playCard: (id) => dispatch(playCard(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(PlayerCards);