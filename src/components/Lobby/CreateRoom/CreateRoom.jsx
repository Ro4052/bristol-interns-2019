import React from 'react';
import { connect } from 'react-redux';
import styles from './CreateRoom.module.css';
import Button from '../../shared/Button/Button';
import { setRoundCount, createRoom } from './CreateRoomActions';

export class CreateRoom extends React.Component {
    constructor(props) {
        super(props);
        this.createRoom = this.createRoom.bind(this);
    }

    createRoom(e) {
        e.preventDefault();
        this.props.createRoom(this.props.numRounds);
    }

    render() {
        const options = [3, 4, 5, 6];
        return (
            <div className={styles.createRoom}>  
                <h1>Create room</h1>
                <form data-cy="room-form" onSubmit={this.createRoom}>
                    <select data-cy="num-rounds-options" onChange={event => this.props.setRoundCount(event.target.value)}>
                        {options.map((option, key) => <option key={key} value={option}>{option} rounds</option>)}
                    </select>
                    <Button cy="create-room" text="Create" />
                </form>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    numRounds: state.createRoomReducer.numRounds
});

const mapDispatchToProps = dispatch => ({
    createRoom: numRounds => dispatch(createRoom(numRounds)),
    setRoundCount: numRounds => dispatch(setRoundCount(numRounds))
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateRoom);
