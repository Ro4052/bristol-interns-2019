import React from 'react';
import { connect } from 'react-redux';
import { playWord, setInvalidWord, validateWord } from '../../store/playerActions';
import Button from '../shared/Button/Button';
import styles from '../PlayWord/PlayWord.module.css'

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
        this.props.validateWord(this.state.currentValue);
    }
    
    render() {
        return (
            <div className={styles.sendWordBox}>
                <input onChange={this.handleChange} value={this.state.currentValue} placeholder="Type in your word" data-cy='type-word' />
                <span className={styles.invalidWord} data-cy= 'send-error'>{this.props.error}</span>
                <Button cy="send-word" handleClick={this.sendMessage} text="Send word" />
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    error: state.playerReducer.error
});

const mapDispatchToProps = (dispatch) => ({
    playWord: (word) => dispatch(playWord(word)),
    setInvalidWord: (bool) => dispatch(setInvalidWord(bool)),
    validateWord: (word) => dispatch(validateWord(word))
});

export default connect(mapStateToProps, mapDispatchToProps)(PlayWord);
