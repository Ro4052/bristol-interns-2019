import React from 'react';
import { connect } from 'react-redux';
import styles from '../Cards.module.css';

export class PlayedCards extends React.Component {
    render() {
        return (
            <ul id="played-cards">
                {this.props.cards.map(card => <img id={"card-" + card.id} className={styles.allCards} alt={"card-" + card.id} key={card.id} src={require(`../cards/card (${card.id}).jpg`)}/>)}
            </ul>
        );
    }
}

const mapStateToProps = (state) => ({
    cards: state.reducer.currentCards
});

export default connect(mapStateToProps)(PlayedCards);
