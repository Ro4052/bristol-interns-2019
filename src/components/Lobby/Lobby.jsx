import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import styles from './Lobby.module.css';
import { CreateRoom } from './CreateRoom/CreateRoom';

export class Lobby extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            joined: false
        };
        this.createRoom = this.createRoom.bind(this);
    }

    createRoom() {
        axios.get('/api/room/create')
        .then(() => {
            this.setState({joined: true});
        })
        .catch((err) => {
            console.log(err.message);
        })
    }

    render() {
        console.log(this.props.rooms);
        return (
            <div className={styles.lobbyPage}>
                <CreateRoom createRoom={this.createRoom}/>
                <ul className={styles.currentRooms}>
                    {this.props.rooms.map((room) => 
                        <li className={styles.singleRoom} key={room.id}>
                            <h2>{"Room: " + room.id}</h2>
                            <ul id="players" data-cy='players-list'>
                                {room.players.map((player, key) => <li key={key}><span data-cy='player-username'>{player}</span></li>)}
                            </ul>
                        </li>
                    )}
                </ul>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        players: state.gameReducer.players,
        rooms: state.gameReducer.rooms
    }
};

export default connect(mapStateToProps)(Lobby);
