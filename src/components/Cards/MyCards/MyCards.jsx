import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { fetchCards, requestPlayCard, finishPlayCard } from '../../../store/playerActions';
import { Card } from '../../shared/Card/Card';

export class MyCards extends React.Component {
    
    constructor() {
        super();
        this.state = {};
        this.playCard = this.playCard.bind(this);
        this.playCardForWord = this.playCardForWord.bind(this);
    }

    componentDidMount() {
        this.props.fetchCards();
    }

    playCard(cardId) {
        if (this.props.playWordAndCard) {
            this.props.requestPlayCard(cardId);
        } else if (this.props.playCard) {
            this.props.requestPlayCard(cardId);
            this.playCardForWord(cardId);
        }
    }

    playCardForWord(cardId) {
        axios.post('/api/playCard', { cardId })
        .then(() => this.props.finishPlayCard(this.props.playedCard))
        .catch(err => console.log(err));
    }

    render() {
        const enabled = (this.props.playWordAndCard || this.props.playCard) && this.props.playedCard === 0;
        return (
            <ul data-cy='my-cards'>
                {this.props.myCards.map(card => <Card card={card} key={card.cardId} handleClick={this.playCard} enabled={enabled} />)}
            </ul>
        );
    }
}

const mapStateToProps = (state) => ({
    playWordAndCard: state.playerReducer.playWordAndCard,
    playCard: state.playerReducer.playCard,
    myCards: state.playerReducer.myCards,
    playedCard: state.playerReducer.playedCard
});

const mapDispatchToProps = (dispatch) => ({
    fetchCards: () => dispatch(fetchCards()),
    requestPlayCard: (cardId) => dispatch(requestPlayCard(cardId)),
    finishPlayCard: (cardId) => dispatch(finishPlayCard(cardId))
});

export default connect(mapStateToProps, mapDispatchToProps)(MyCards);
