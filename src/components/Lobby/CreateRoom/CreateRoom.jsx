import React from 'react';
import { connect } from 'react-redux';
import styles from './CreateRoom.module.css';
import { setRoundCount, createRoom, setGameMode } from './CreateRoomActions';

export class CreateRoom extends React.Component {
    constructor(props) {
        super(props);
        this.createRoom = this.createRoom.bind(this);
    }

    createRoom(e) {
        e.preventDefault();
        this.props.createRoom(this.props.numRounds, this.props.gameMode);
    }

    render() {
        const options = [3, 4, 5, 6];
        return (
            <div className={styles.createRoom}>  
                <h1 className={styles.createRoomHeader}>Create room</h1>
                <span>{this.props.error}</span>
                <form className={styles.createRoomForm} data-cy="create-room-form" onSubmit={this.createRoom}>
                    <select className={styles.selectRounds} data-cy="num-rounds-options" onChange={event => this.props.setRoundCount(event.target.value)}>
                        {options.map((option, key) => <option key={key} value={option}>{option} rounds</option>)}
                    </select>
                    <select className={styles.selectRounds} data-cy="mode-options" onChange={event => this.props.setGameMode(event.target.value)}>
                        <option value={"telltales"}>TellTales Images</option>
                        <option value={"custom"}>Custom Images</option>
                    </select>
                    <button className={styles.createRoomButton} data-cy="create-room" type='submit'>Create</button>
                </form>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    numRounds: state.createRoomReducer.numRounds,
    gameMode: state.createRoomReducer.gameMode,
    error: state.createRoomReducer.error
});

const mapDispatchToProps = dispatch => ({
    createRoom: (numRounds, gameMode) => dispatch(createRoom(numRounds, gameMode)),
    setRoundCount: numRounds => dispatch(setRoundCount(numRounds)),
    setGameMode: mode => dispatch(setGameMode(mode))
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateRoom);
