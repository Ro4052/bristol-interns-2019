import React from 'react';
import { connect } from 'react-redux';
import { fetchCards, selectCard } from './MyCardsActions';
import CardList from '../shared/CardList/CardList';

export class MyCards extends React.Component {

    componentDidMount() {
        this.props.fetchCards();
    }

    render() {
        return (
            <CardList cards={this.props.cards} handleClick={this.props.selectCard} hidden={false} isEnabled={() => this.props.playCard || this.props.playWord} cy="my-cards" />
        );
    }
}

const mapStateToProps = state => ({
    playWord: state.playWordReducer.playWord,
    playCard: state.myCardsReducer.playCard,
    cards: state.myCardsReducer.cards,
    playedCardId: state.myCardsReducer.playedCardId
});

const mapDispatchToProps = dispatch => ({
    fetchCards: () => dispatch(fetchCards()),
    selectCard: cardId => dispatch(selectCard(cardId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MyCards);
