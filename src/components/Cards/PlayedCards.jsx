import React from 'react';
import { connect } from 'react-redux';
import styles from './Cards.module.css';

export class PlayedCards extends React.Component {
    render() {
        console.log("Played cards");
        console.log(this.props.cards);
        return (
            <ul id="played-cards">
                {this.props.cards.map(card => {
                    return <img id={"card-" + card.id} className={styles.allCards}  alt='' key={card.id} src={require(`./cards/card (${card.id}).jpg`)}/>
                })}
            </ul>
        );
    }
}

const mapStateToProps = (state) => ({
    cards: state.reducer.currentCards
});

export default connect(mapStateToProps)(PlayedCards);
