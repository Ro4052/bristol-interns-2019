import React from 'react';
import { connect } from 'react-redux';
import { fetchCards, selectCard } from './MyCardsActions';
import CardList from '../shared/CardList/CardList';
import styles from './MyCards.module.css';

export class MyCards extends React.Component {

    componentDidMount() {
        this.props.fetchCards();
    }

    render() {
        return (
            <div className={styles.myCards}>
                <CardList cards={this.props.cards} handleClick={this.props.selectCard} isEnabled={() => this.props.playCard} cy={"my-cards"} />
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    playCard: state.myCardsReducer.playCard,
    cards: state.myCardsReducer.cards,
    playedCardId: state.myCardsReducer.playedCardId
});

const mapDispatchToProps = (dispatch) => ({
    fetchCards: () => dispatch(fetchCards()),
    selectCard: (cardId) => dispatch(selectCard(cardId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MyCards);
