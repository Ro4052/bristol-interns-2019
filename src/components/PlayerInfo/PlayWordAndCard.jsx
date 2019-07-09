import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import styles from './PlayWordAndCard.module.css';
import { finishPlayCard } from '../../store/playerActions';
import { playWord } from '../../store/playerActions';

export class PlayWordAndCard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            currentValue: ''
        }
        this.handleChange = this.handleChange.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.endTurn = this.endTurn.bind(this);
    }

    handleChange(event) {
        this.setState({ currentValue: event.target.value });
    }

    sendMessage() {
        this.props.playWord(this.state.currentValue);
    }

    endTurn() {        
        if (this.props.myWord && this.props.playedCard) {
            axios.post('/api/playCardWord', {
                card: this.props.playedCard,
                word: this.props.myWord
            })
            .then(() => {
                this.props.finishPlayCard(this.props.playedCard);
            })
            .catch(err => {
                console.log(err);
            });
        }
    }
    
    render() {
        const sendWord = (
            <div className={styles.messageBox}>
                <input onChange={this.handleChange} value={this.state.currentValue} placeholder="Type in your word" />
                <button id="send-message" className={styles.sendWordButton} onClick={this.sendMessage}>Send word</button>
            </div>
        );
        return (
            <div className={styles.playerInteractions}>
                {!this.props.myWord && <h3>Type in a word</h3>}
                {!this.props.playedCard && <h3>Pick a card</h3>}
                {!this.props.myWord && sendWord}
                {this.props.myWord && this.props.playedCard && !this.props.finishedRound && <button id="end-turn" onClick={this.endTurn}>End my turn</button>}
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    playWordAndCard: state.playerReducer.playWordAndCard,
    playCard: state.playerReducer.playCard,
    myWord: state.playerReducer.myWord,
    playedCard: state.playerReducer.playedCard,
    finishedRound: state.playerReducer.finishedRound
});

const mapDispatchToProps = (dispatch) => ({
    finishPlayCard: (id) => dispatch(finishPlayCard(id)),
    playWord: (word) => dispatch(playWord(word))
});

export default connect(mapStateToProps, mapDispatchToProps)(PlayWordAndCard);
