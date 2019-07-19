import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { authenticateUser, setPlayCard, setPlayWord } from '../../../store/playerActions';

export class Auth extends React.Component {

    componentDidMount() {
        this.props.authenticateUser();
        this.instructPlayerOnRefresh();
    }

    instructPlayerOnRefresh() {
        if (this.props.currentPlayer) {
            if (this.props.status === "WAITING_FOR_CURRENT_PLAYER") {
                this.props.setPlayCard(this.props.playedCard === 0 && !this.props.finishedRound && this.props.currentPlayer.username === this.props.cookie);
            } else {
                this.props.setPlayCard(this.props.playedCard === 0 && !this.props.finishedRound);
            }
            this.props.setPlayWord(this.props.currentPlayer.username === this.props.cookie && this.props.status === "WAITING_FOR_CURRENT_PLAYER" && !this.props.myWord && !this.props.finishedRound);
        }
    }

    render() {
        if (this.props.cookie) return this.props.render();
        return (<Redirect to='/' />);
    }
}

const mapStateToProps = (state) => ({
    cookie: state.playerReducer.cookie,
    currentPlayer: state.gameReducer.currentPlayer,
    status: state.gameReducer.status,
    finishedRound: state.gameReducer.finishedRound,
    playedCard: state.playerReducer.playedCard,
    myWord: state.playerReducer.myWord
});

const mapDispatchToProps = (dispatch) => ({
    authenticateUser: () => dispatch(authenticateUser()),
    setPlayWord: (bool) => dispatch(setPlayWord(bool)),
    setPlayCard: (bool) => dispatch(setPlayCard(bool))
});

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
