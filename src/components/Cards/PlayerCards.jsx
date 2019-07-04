import React from 'react';
import styles from './Cards.module.css';
import { connect } from 'react-redux';
import { fetchCards, requestPlayCard } from '../../store/playerActions';

export class PlayerCards extends React.Component {
    constructor() {
        super();
        this.state = {
            playedCardText: ""
        }
    }
    componentDidMount() {
        this.props.fetchCards();
    }
    getPlayerCards() {
        let cardImages = [];
        if (this.props.myCards) {
            for (let i = 0; i < this.props.myCards.length; i++) {
                let index = this.props.myCards[i]
                cardImages.push({
                    url: require(`./cards/card (${index}).jpg`),
                    id: index
                });
            }
        }
        return cardImages;
    }
    playCard(card) {
        if (this.props.myTurn) {
            this.props.requestPlayCard(card.target.id.split('-')[1]);
        }
    }
        
    disableOnEndTurn() {
        return (this.props.myTurn) ? styles.singleCard : styles.disabledCard
    }
    render() {
        const cardsImages = this.getPlayerCards().map((card) => (
            <img id={"card-" + card.id} alt='' className={this.disableOnEndTurn()} key={card.id} src={card.url} onClick={this.playCard.bind(this)}/>
        ))
        return (
            <div className={styles.cardsContainer} id="my-cards">
                <h2>{this.state.playedCardText}</h2>
                <ul>
                    {cardsImages}
                </ul>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return ({
        myTurn: state.reducer.gameState.myTurn,
        myCards: state.playerReducer.myCards,
        currentPlayer: state.reducer.gameState.currentPlayer,
        socket: state.reducer.socket
    });
};

const mapDispatchToProps = (dispatch) => ({
    fetchCards: () => dispatch(fetchCards()),
    requestPlayCard: (id) => dispatch(requestPlayCard(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PlayerCards);