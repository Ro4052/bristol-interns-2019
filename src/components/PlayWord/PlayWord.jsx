import React from 'react';
import { connect } from 'react-redux';
import { playWord } from '../../store/playerActions';
import Button from '../shared/Button/Button';
import styles from '../PlayerInteractions/PlayerInteractions.module.css'

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
        this.props.playWord(this.state.currentValue);
    }
    
    render() {
        return (
            <div className={styles.sendWordBox}>
                <input onChange={this.handleChange} value={this.state.currentValue} placeholder="Type in your word" data-cy='type-word' />
                <Button cy="send-word" handleClick={this.sendMessage} text="Send word" />
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => ({
    playWord: (word) => dispatch(playWord(word))
});

export default connect(null, mapDispatchToProps)(PlayWord);
