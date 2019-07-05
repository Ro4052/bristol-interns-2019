import React from 'react';
import { connect } from 'react-redux';
import AllCards from '../Cards/AllCards'
import PlayerInteractions from '../PlayerInfo/PlayerInteractions'
import PlayerCards from '../Cards/PlayerCards';
import LogoutButton from '../Login/LogoutButton';
import Players from '../PlayerInfo/Players';
import style from './Dashboard.module.css';
import { setSocket } from '../../store/actions';
import connectSocket from '../../services/socket';
import { dispatch } from '../../store/store';
import { finishPlayCard } from '../../store/playerActions';

export class Dashboard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
        // If log in succeeds, connect to the socket
        const socket = connectSocket();
        console.log("connectSocket");
        dispatch(setSocket(socket));
    }

    render() {
        return (
            <div className={style.roundInfo}>
                {!this.props.status === "NOT_STARTED" && <h2>Round: <span id="round-number">{this.props.roundNum}</span></h2>}
                <h2>Current player: {this.props.currentPlayer && <span id="current-player">{this.props.currentPlayer.username}</span>}</h2>
                <Players players={this.props.allPlayers} />
                <AllCards />
                <PlayerCards />
                <PlayerInteractions started={this.props.status !== "NOT_STARTED"}/>
                <LogoutButton />
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return ({
        status: state.reducer.status,
        socket: state.reducer.socket,
        roundNum: state.reducer.roundNum,
        currentPlayer: state.reducer.currentPlayer,
        allPlayers: state.reducer.allPlayers,
        myWord: state.playerReducer.myWord,
        myTurn: state.playerReducer.myTurn,
        othersTurn: state.playerReducer.othersTurn,
        playedCard: state.playerReducer.playedCard
    });
}

const mapDispatchToProps = (dispatch) => ({
    finishPlayCard: (id) => dispatch(finishPlayCard(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
