import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { authenticateUser, setPlayCard, setPlayWordAndCard } from '../../store/playerActions';

export class Auth extends React.Component {

    componentDidMount() {
        this.props.authenticateUser();
        this.instructPlayerOnRefresh();
    }

    instructPlayerOnRefresh() {
        if (this.props.currentPlayer) {
            this.props.setPlayWordAndCard(this.props.currentPlayer.username === this.props.cookie && this.props.status === "WAITING_FOR_CURRENT_PLAYER");
            this.props.setPlayCard(this.props.currentPlayer.username !== this.props.cookie && this.props.status === "WAITING_FOR_OTHER_PLAYERS")
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
    status: state.gameReducer.status
});

const mapDispatchToProps = (dispatch) => ({
    authenticateUser: () => dispatch(authenticateUser()),
    setPlayWordAndCard: (bool) => dispatch(setPlayWordAndCard(bool)),
    setPlayCard: (bool) => dispatch(setPlayCard(bool))
});

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
