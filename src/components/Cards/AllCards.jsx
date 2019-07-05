import React from 'react';
import { connect } from 'react-redux';
import styles from './Cards.module.css';

export class AllCards extends React.Component {
    getCardItems() {
        if (this.props.cards) {
            return this.props.cards.map(card => (
                <img className={styles.allCards} key={card.id} src={require(`./cards/back.jpg`)}></img>
            ))
        }
        return <></>;
    }
    render() {
        const cardItems = this.getCardItems();
        return (
            <div className="playedCards" id="played-cards">
                <ul>
                    {cardItems}
                </ul>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return ({
        cards: state.reducer.gameState.currentCards
    });
};

export default connect(mapStateToProps)(AllCards);