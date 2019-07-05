import React from 'react';
import { connect } from 'react-redux';
import styles from './Cards.module.css';

export class AllCards extends React.Component {

    getCardItems() {
        if (this.props.cards) {
            return this.props.cards.map(card => (
                <img className={styles.allCards} alt='' key={card.id} src={require(`../Dashboard/dixit_logo.png`)}></img>
                
            ))
        }
        return <></>;
    }

    render() {
        const cardItems = this.getCardItems();
        return (
            <ul className={styles.playedCards} id="played-cards">
                {cardItems}
            </ul>
        );
    }
}

const mapStateToProps = (state) => ({
    cards: state.reducer.currentCards
});

export default connect(mapStateToProps)(AllCards);
