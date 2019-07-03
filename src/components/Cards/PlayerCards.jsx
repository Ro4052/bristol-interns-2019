import React from 'react';
import axios from 'axios';
import styles from './Cards.module.css';
import socket from '../../socket';

export default class Cards extends React.Component {
    constructor() {
        super();
        this.state = {
            cards: [],
            playedCardText: ""
        }
    }
    componentDidMount() {
        axios.get('/api/cards')
        .then((response) => {
            var cards = [];
            for (var i = 0; i < response.data.length; i++) {
                var index = response.data[i]
                cards.push({
                    url: require(`./cards/card (${index}).jpg`),
                    id: index
                });
            }
            this.setState({
                cards: cards
            })
        }).catch(err => {
            console.log(err);
        })
    }
    playCard(card) {
        socket.emit("play card", card.target.id)
    }
    disableOnEndTurn() {
        return (this.props.myTurn) ? styles.singleCard : styles.disabledCard
    }
    render() {        
        const cardsImages = this.state.cards.map((card, index) => (
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