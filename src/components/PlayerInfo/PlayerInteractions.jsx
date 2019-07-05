import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import Message from '../Message/Message';
import style from '../Dashboard/Dashboard.module.css';
import { finishPlayCard } from '../../store/playerActions';

export class PlayerInteractions extends React.Component {
    constructor(props) {
        super(props);
        this.startGame = this.startGame.bind(this);
        this.endTurn = this.endTurn.bind(this);
    }
    startGame() {
        axios.get('/api/start')
        .then(res => {
            // console.log(res);
        })
        .catch(err => {
            console.log(err);
        });
    }
    endTurn() {        
        if (this.props.myWord && this.props.playedCard) {
            axios.post('/api/playCardWord', {
                card: this.props.playedCard,
                word: this.props.myWord
            })
            .then(() => {
                this.props.finishPlayCard(this.props.playedCard)
            })
            .catch(err => {
                console.log(err);
            });
        }
    }
    render() {
        const startGameButton = <button id="start-game" onClick={this.startGame}>Start game</button>;
        const nextTurnButton = (this.props.myTurn && !this.props.finishedRound) ? <button id="end-turn" onClick={this.endTurn}>End my turn</button> : "";
        const pickWordText = (this.props.myTurn && !this.props.myWord) ? <h3>Type in a word</h3> : "";
        const pickCardText = ((this.props.playedCard === 0) && (this.props.myTurn || this.props.othersTurn)) ? <h3>Pick a card</h3> : "";
        return (
            <div className={style.playerInteractions}>
                {pickWordText}
                {(pickCardText && pickWordText) ? <h3>{"&"}</h3> : ""}
                {pickCardText}
                {!(pickCardText || pickWordText) && this.props.myTurn  && !this.props.finishedRound ? <h3>Now click "End my turn"</h3> : ""}
                <Message />
                {this.props.started ? nextTurnButton : startGameButton}
            </div>
        )
    }
}

const mapStateToProps = (state, props) => {
    console.log(state.playerReducer.playedCard);
    
    return({
        myWord: state.playerReducer.myWord,
        myTurn: state.playerReducer.myTurn,
        othersTurn: state.playerReducer.othersTurn,
        playedCard: state.playerReducer.playedCard,
        finishedRound: state.playerReducer.finishedRound
    });
}

const mapDispatchToProps = (dispatch) => ({
    finishPlayCard: (id) => dispatch(finishPlayCard(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(PlayerInteractions);