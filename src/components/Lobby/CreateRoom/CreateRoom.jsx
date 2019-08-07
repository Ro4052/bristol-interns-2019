import React from 'react';
import { connect } from 'react-redux';
import styles from './CreateRoom.module.css';
import { setRoundCount } from './CreateRoomActions';
import Button from '../../shared/Button/Button';

export class CreateRoom extends React.Component {
    render() {
        const options = [3, 4, 5, 6];
        return (
            <div className={styles.createRoom}>  
                <h1>Create room: </h1>
                <select defaultValue="How many rounds in your game?" className={styles.roundCountBox} data-cy="num-rounds-options" onChange={event => this.props.setRoundCount(event.target.value)}>
                    <option disabled>How many rounds in your game?</option>
                    {options.map((option, key) => <option key={key} value={option}>{option}</option>)}
                </select>
                {this.props.numRounds && <Button cy="create-room" handleClick={() => this.props.createRoom(this.props.numRounds)} text="Create Room" />}     
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    setRoundCount: numRounds => dispatch(setRoundCount(numRounds))
});

export default connect(null, mapDispatchToProps)(CreateRoom);
