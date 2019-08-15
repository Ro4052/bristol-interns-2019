import React from 'react';
import { connect } from 'react-redux';
import { voteForCard } from './PlayedCardsActions';
import CardList from '../shared/CardList/CardList';
import Card from '../shared/CardList/Card/Card';
import styles from './PlayedCards.module.css';

export class PlayedCards extends React.Component {
    
    constructor(props) {
        super(props);
        this.isEnabled = this.isEnabled.bind(this);
    }

    isEnabled(cardId) {
        return this.props.voteCard && (cardId !== this.props.playedCardId);
    }

    render() {
        return (
            <div className={styles.playedCards}>
                {this.props.myCard &&
                <div data-cy="played-card" className={styles.myCard}>
                    <Card card={this.props.myCard} />
                    <h2 className={styles.text}>Your card</h2>
                </div>}
                <div className={styles.otherCards}>
                    <div className={styles.inner}>
                        <CardList cards={this.props.cards} handleClick={this.props.voteForCard} isEnabled={this.isEnabled} cy="played-cards" />
                    </div>
                    
                </div>            
            </div>
        );
    }
}

const mapStateToProps = state => ({
    cards: state.playedCardsReducer.cards,
    myCard: state.playedCardsReducer.myCard,
    voteCard: state.playedCardsReducer.voteCard,
    playedCardId: state.myCardsReducer.playedCardId,
    votes: state.playedCardsReducer.votes
});

const mapDispatchToProps = dispatch => ({
    voteForCard: cardId => dispatch(voteForCard(cardId))
});

export default connect(mapStateToProps, mapDispatchToProps)(PlayedCards);
