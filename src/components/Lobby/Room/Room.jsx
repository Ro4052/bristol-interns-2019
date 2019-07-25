import React from 'react';
import { connect } from 'react-redux';
import styles from '../Lobby.module.css';
import StartGame from '../../StartGame/StartGame';

export class Room extends React.Component {

    constructor() {
        super();
        this.state = {};
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.props.handleClick(this.props.room.id);
    }

    render() {
        return (
            <li className={styles.singleRoom} key={this.props.room.id} data-cy="single-room">
                <h2 onClick={this.handleClick} data-cy="room-title">{"Room: " + this.props.room.id}</h2>
                <ul id="players" data-cy='players-list'>
                    {this.props.room.players.map((player, key) => <li key={key}><span data-cy='player-username'>{player}</span></li>)}
                </ul>
                {this.props.status === "NOT_STARTED" && <StartGame />}
            </li>
        );
    }
}

const mapStateToProps = (state) => ({
    status: state.dashboardReducer.status
});

export default connect(mapStateToProps)(Room);
