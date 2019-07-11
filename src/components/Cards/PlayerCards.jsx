import React from 'react';
import axios from 'axios';
import styles from './Cards.module.css';
import { connect } from 'react-redux';
import { fetchCards, requestPlayCard, finishPlayCard } from '../../store/playerActions';

export class PlayerCards extends React.Component {
    constructor() {
        super();
        this.state = {};
        this.playCard = this.playCard.bind(this);
        this.handleClickCard = this.handleClickCard.bind(this);
    }

    componentDidMount() {
        this.props.fetchCards();
    }

    playCard(id) {
        if (this.props.playWordAndCard) {
            this.props.requestPlayCard(id);
        } else if (this.props.playCard) {
            this.props.requestPlayCard(id);
            this.playCardForWord(id);
        }
    }

    playCardForWord(card) {
        axios.post('/api/playCard', {
            card: card,
        })
        .then(() => {
            this.props.finishPlayCard(this.props.playedCard);
        })
        .catch(err => {
            console.log(err);
        });
    }

    handleClickCard(event) {
        if (!this.props.playedCard) {
            const id = event.target.id.split('-')[1];
            this.playCard(id);
        }
    }

    getCardClass() {
        return ((this.props.playWordAndCard || this.props.playCard) && this.props.playedCard === 0) ? styles.singleCard : styles.disabledCard
    }

    render() {
        return (
            <div className={styles.cardsContainer} id="my-cards">
                <ul data-cy='my-cards'>
                    {this.props.myCards.map(card => <img id={"card-" + card.id} alt={"card-" + card.id} className={this.getCardClass()} key={card.id} src={require(`./cards/card (${card.id}).jpg`)} onClick={this.handleClickCard} />)}
                </ul>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    playWordAndCard: state.playerReducer.playWordAndCard,
    playCard: state.playerReducer.playCard,
    myCards: state.playerReducer.myCards,
    playedCard: state.playerReducer.playedCard,
    finishedRound: state.playerReducer.finishedRound
});

const mapDispatchToProps = (dispatch) => ({
    fetchCards: () => dispatch(fetchCards()),
    requestPlayCard: (id) => dispatch(requestPlayCard(id)),
    finishPlayCard: (id) => dispatch(finishPlayCard(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(PlayerCards);
