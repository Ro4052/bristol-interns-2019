import React from 'react';
import { connect } from 'react-redux';
import { playWord } from '../Cards/playerActions';

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
            <div>
                <input onChange={this.handleChange} value={this.state.currentValue} placeholder="Type in your word" />
                <button id="send-message" className="chat-button" onClick={this.sendMessage}>Send a message</button>
            </div>
        );
        return (
            <div>
                {this.props.myTurn && box}
                <div>
                    <h1 id="message">{this.props.currentWord}</h1>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return ({
        myTurn: state.reducer.gameState.myTurn,
        currentWord: state.reducer.gameState.currentWord,
        socket: state.reducer.socket
    });
}

const mapDispatchToProps = (dispatch) => ({
    playWord: (word) => dispatch(playWord(word))
});

export default connect(mapStateToProps, mapDispatchToProps)(Message);
