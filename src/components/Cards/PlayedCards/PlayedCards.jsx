import React from 'react';
import { connect } from 'react-redux';
import styles from '../Cards.module.css';

export class PlayedCards extends React.Component {
    render() {
        console.log(this.props.cards);
        return (
            <ul id="played-cards">
                {this.props.cards.map(card => <img id={"card-" + card.cardId} key={card.cardId} className={styles.allCards} alt={"card-" + card.cardId} src={require(`../cards/card (${card.cardId}).jpg`)}/>)}
            </ul>
        );
    }
}

const mapStateToProps = (state) => ({
    cards: state.reducer.currentCards
});

export default connect(mapStateToProps)(PlayedCards);
