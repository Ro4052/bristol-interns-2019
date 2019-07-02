import React from 'react';

export default class AllCards extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const cardItems = this.props.cards.map(card => (
            <li key={card.id}>{card.id}</li>
        ))
        return (
            <div className="playedCards">
                {cardItems}
            </div>
        );
    }
}