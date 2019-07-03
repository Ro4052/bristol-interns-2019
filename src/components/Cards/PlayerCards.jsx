import React from 'react';
import styles from './Cards.module.css';
import socket from '../../socket';
import { connect } from 'react-redux';

class PlayerCards extends React.Component {
    constructor() {
        super();
        this.state = {
            cardImages: [],
            playedCardText: ""
        }
    }
    getPlayerCards() {
        let cardImages = [];
        if (this.props.currentPlayer) {
            for (let i = 0; i < this.props.currentPlayer.cards.length; i++) {
                let index = this.props.currentPlayer.cards[i]
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
    }
    disableOnEndTurn() {
        return (this.props.myTurn) ? styles.singleCard : styles.disabledCard
    }
    render() {
        
        const cardsImages = this.getPlayerCards().map((card) => (
            <img id={card.id} alt='' className={this.disableOnEndTurn()} key={card.id} src={card.url} onClick={this.playCard.bind(this)}/>
        ))
        return (
            <div className={styles.cardsContainer}>
                <h2>{this.state.playedCardText}</h2>
                {cardsImages}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return ({
        myTurn: state.gameState.myTurn,
        currentPlayer: state.gameState.currentPlayer
    });
};

export default connect(mapStateToProps)(PlayerCards);