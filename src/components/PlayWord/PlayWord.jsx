import React from 'react';
import { connect } from 'react-redux';
import styles from './PlayWord.module.css';
import { playWord } from '../../store/playerActions';
import axios from 'axios';

export class PlayWord extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            currentValue: ''
        }
        this.handleChange = this.handleChange.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
    }

    handleChange(event) {
        this.setState({ currentValue: event.target.value });
    }

    sendMessage() {
        axios.post('/api/validWord', {
            word: this.state.currentValue
        })
        .then(() => {
            this.props.playWord(this.state.currentValue);
        })
        .catch(err => {
            console.log(err);
        });
    }
    
    render() {
        return (
            <div className={styles.messageBox}>
                <input onChange={this.handleChange} value={this.state.currentValue} placeholder="Type in your word" data-cy='type-word' />
                <button id="send-message" className={styles.sendWordButton} onClick={this.sendMessage} data-cy='send-word'>Send word</button>
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => ({
    playWord: (word) => dispatch(playWord(word))
});

export default connect(null, mapDispatchToProps)(PlayWord);
