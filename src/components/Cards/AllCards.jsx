import React from 'react';
import { connect } from 'react-redux';

class AllCards extends React.Component {
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

const mapStateToProps = (state) => {
    return ({
        cards: state.gameState.currentCards
    });
};

export default connect(mapStateToProps)(AllCards);