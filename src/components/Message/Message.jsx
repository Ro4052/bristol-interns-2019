import React from 'react';
import { connect } from 'react-redux';
import { playWord } from '../../store/playerActions';
import style from './Message.module.css';

export class Message extends React.Component {

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
        const box = (
            <>
                <input onChange={this.handleChange} value={this.state.currentValue} placeholder="Type in your word" />
                <button id="send-message" className={style.sendWordButton} onClick={this.sendMessage}>Send word</button>
            </>
        );
        return (
            <div className={style.messageBox}>
                <div>
                    <h1 id="message">{this.props.message}</h1>
                </div>
                {(this.props.myTurn) ? box : ""}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return ({
        myTurn: state.reducer.myTurn,
        message: state.reducer.message,
        socket: state.reducer.socket
    });
}

const mapDispatchToProps = (dispatch) => ({
    playWord: (word) => dispatch(playWord(word))
});

export default connect(mapStateToProps, mapDispatchToProps)(Message);
