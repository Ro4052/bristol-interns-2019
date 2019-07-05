import React from 'react';
import { connect } from 'react-redux';
import AllCards from '../Cards/AllCards'
import PlayerInteractions from '../PlayerInfo/PlayerInteractions'
import PlayerCards from '../Cards/PlayerCards';
import LogoutButton from '../Login/LogoutButton';
import Players from '../PlayerInfo/Players';
import style from './Dashboard.module.css';
import axios from 'axios';
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
        dispatch(setSocket(socket));
    }
    render() {
        return (
            <div className={style.roundInfo}>
                {this.props.gameState.started && <h2>Round: <span id="round-number">{this.props.gameState.roundNum}</span></h2>}
                <h2>Current player: {this.props.gameState.currentPlayer && <span id="current-player">{this.props.gameState.currentPlayer.username}</span>}</h2>
                <Players players={this.props.gameState.players} />
                <AllCards />
                <PlayerCards />
                <PlayerInteractions started={this.props.gameState.started}/>
                <LogoutButton />
            </div>
        )
    }
}


const mapStateToProps = (state, props) => {
    return({
        socket: state.reducer.socket,
        gameState: state.reducer.gameState,
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
