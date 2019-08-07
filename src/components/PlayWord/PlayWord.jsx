import React from 'react';
import { connect } from 'react-redux';
import { sendWord } from './PlayWordActions';
import Button from '../shared/Button/Button';
import styles from '../PlayWord/PlayWord.module.css';
import Prompt from '../shared/Prompt/Prompt';

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
        this.props.sendWord(this.state.currentValue);
    }

    render() {
        return (
            <div className={styles.sendWordBox}>
                <Prompt cy="play-word" text="Type in the word that best describes the card you picked" />
                <input className={styles.entryBox} onChange={this.handleChange} value={this.state.currentValue} placeholder="Type a word" data-cy='type-word' />
                <span className={styles.invalidWord} data-cy= 'send-error'>{this.props.error}</span>
                <Button cy="send-word" handleClick={this.sendMessage} text="Send word" />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    error: state.playWordReducer.error
});

const mapDispatchToProps = dispatch => ({
    sendWord: word => dispatch(sendWord(word))
});

export default connect(mapStateToProps, mapDispatchToProps)(PlayWord);
