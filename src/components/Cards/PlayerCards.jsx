import React from 'react';
import styles from './Cards.module.css';
import socket from '../../socket';
import { connect } from 'react-redux';
import Axios from 'axios';

export class PlayerCards extends React.Component {
    constructor() {
        super();
        this.state = {
            cardImages: [],
            playedCardText: ""
        }
    }
    componentDidMount() {
        let cardImages = [];
        Axios.get('/api/cards')
        .then(response => {
            console.log(response.data);
        })
        .catch(err => {
            console.log(err);
        })
    }
    playCard(card) {
        socket.emit("play card", card.target.id)
        return card.id
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
    return ({
        myTurn: state.gameState.myTurn,
        currentPlayer: state.gameState.currentPlayer
    });
};

export default connect(mapStateToProps)(PlayerCards);