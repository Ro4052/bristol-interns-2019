import React from 'react';
import { connect } from 'react-redux';
import AllCards from '../Cards/AllCards'
import PlayerCards from '../Cards/PlayerCards';
import LogoutButton from '../Login/LogoutButton';
import Players from '../PlayerInfo/Players';
import style from './Dashboard.module.css';
import { setSocket } from '../../store/actions';
import connectSocket from '../../services/socket';
import { dispatch } from '../../store/store';
import { finishPlayCard } from '../../store/playerActions';
import PlayCard from '../PlayerInfo/PlayCard';
import PlayWordAndCard from '../PlayerInfo/PlayWordAndCard';
import axios from 'axios';

export class Dashboard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    startGame() {
        axios.get('/api/start')
        .catch(err => {
            console.log(err);
        });
    }

    componentDidMount() {
        const socket = connectSocket();
        dispatch(setSocket(socket));
    }

    render() {
        return (
            <div className={style.roundInfo}>
                {this.props.status === "NOT_STARTED" && <button id="start-game" onClick={this.startGame}>Start game</button>}
                {this.props.status !== "NOT_STARTED" && <h2>Round: <span id="round-number">{this.props.roundNum}</span></h2>}
                {this.props.currentPlayer && <h2>Current player: <span id="current-player">{this.props.currentPlayer.username}</span></h2>}
                <h1 id="message">{this.props.currentWord}</h1>
                <Players />
                <AllCards />
                <PlayerCards />
                {this.props.playWordAndCard && <PlayWordAndCard />}
                {this.props.playCard && <PlayCard />}
                <LogoutButton />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return ({
        status: state.reducer.status,
        roundNum: state.reducer.roundNum,
        currentPlayer: state.reducer.currentPlayer,
        playWordAndCard: state.playerReducer.playWordAndCard,
        playCard: state.playerReducer.playCard,
        currentWord: state.reducer.currentWord
    });
}

const mapDispatchToProps = (dispatch) => ({
    finishPlayCard: (id) => dispatch(finishPlayCard(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
