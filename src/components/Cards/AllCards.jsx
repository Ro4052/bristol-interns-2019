import React from 'react';

export default class AllCards extends React.Component {
    getCardItems() {
        if (this.props.cards) {
            return this.props.cards.map(card => (
                <li key={card.id}>{card.id}</li>
            ))
        }
        return <></>;
    }
    render() {
        const cardItems = this.getCardItems();
        return (
            <div className="playedCards">
                {cardItems}
            </div>
        );
    }
}