import React from 'react';
import axios from 'axios';

export default class Cards extends React.Component {
    constructor() {
        super();
        this.state = {
            cards: []
        }
    }
    componentDidMount() {
        axios.get('/api/cards')
        .then((response) => {
            var cards = [];
            for (var i = 0; i < response.data.length; i++) {
                var index = response.data[i]
                cards.push(require(`./cards/card (${index}).jpg`))
            }
            this.setState({
                cards: cards
            })
        }).catch(err => {
            console.log(err);
        })
    }
    render() {         
        const cardsImages = this.state.cards.map((card, index) => (
            <img height="400" width="250" key={index} src={card} alt='' />
        ))
        return (
            <div>
                {cardsImages}
            </div>
        );
    }
}