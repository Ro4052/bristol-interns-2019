import React from 'react';
import { connect } from 'react-redux';
import { playWord } from '../../store/playerActions';

export class Message extends React.Component {


    render() {
        
        return (
            <div>Message</div> 
        )
    }
}

const mapStateToProps = (state) => {
    return ({
        myTurn: state.reducer.myTurn,
        finishedRound: state.playerReducer.finishedRound,
        message: state.reducer.message,
        socket: state.reducer.socket
    });
}

const mapDispatchToProps = (dispatch) => ({
    playWord: (word) => dispatch(playWord(word))
});

export default connect(mapStateToProps, mapDispatchToProps)(Message);
