import React from 'react';
import axios from 'axios';
import styles from './Cards.module.css';

export default class Cards extends React.Component {
    constructor() {
        super();
        this.state = {
            cards: [],
            playedCardText: ""
        }
    }
    componentWillMount() {
        axios.get('/auth')
        .then((response) => {
            if (response.status !== 200) {
                window.location = '/';
            }
        }).catch(err => {
            console.log(err);
            window.location = '/';
        })
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
        console.log(card.target.id);
        this.setState({
            playedCardText: "You played card " + card.target.id.toString()
        })
    }
    render() {        
        const cardsImages = this.state.cards.map((card, index) => (
            <img id={card.id} className={styles.singleCard} key={card.id} src={card.url} onClick={this.playCard.bind(this)}/>
        ))
        return (
            <div className={styles.cardsContainer}>
                <h2>{this.state.playedCardText}</h2>
                {cardsImages}
            </div>
        );
    }
}