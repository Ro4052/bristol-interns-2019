import React from 'react';
import { connect } from 'react-redux';
import { playWord } from '../../store/playerActions';
import { setInvalidWord } from '../../store/gameActions';
import axios from 'axios';
import Button from '../shared/Button/Button';
import styles from '../PlayWord/PlayWord.module.css'

export class PlayWord extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            currentValue: '',
            error: ''
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
            this.props.setInvalidWord(false);
            this.props.playWord(this.state.currentValue);
        })
        .catch(err => {
            console.log(err);
            this.props.setInvalidWord(true);
            this.setState( {
                error: 'Invalid word'
            });
        });
    }
    
    render() {
        return (
            <div className={styles.sendWordBox}>
                <input onChange={this.handleChange} value={this.state.currentValue} placeholder="Type in your word" data-cy='type-word' />
                <span className={styles.invalidWord} data-cy= 'send-error'>{this.state.error}</span>
                <Button cy="send-word" handleClick={this.sendMessage} text="Send word" />
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => ({
    playWord: (word) => dispatch(playWord(word)),
    setInvalidWord: (bool) => dispatch(setInvalidWord(bool))
});

export default connect(null, mapDispatchToProps)(PlayWord);
