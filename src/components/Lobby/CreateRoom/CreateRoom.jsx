import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styles from './CreateRoom.module.css';
import { setRoundCount, createRoom, setGameMode } from './CreateRoomActions';

function CreateRoom() {
    const { numRounds, gameMode, error } = useSelector(state => state.createRoomReducer);
    const dispatch = useDispatch();

    const submitCreateRoom = e => {
        e.preventDefault();
        dispatch(createRoom(numRounds, gameMode));
    }

    const options = [3, 4, 5, 6];
    return (
        <div className={styles.createRoom}>  
            <h2 className={styles.createRoomHeader}>Create room</h2>
            <form className={styles.createRoomForm} data-cy="create-room-form" onSubmit={submitCreateRoom}>
                <select className={styles.selectRounds} data-cy="num-rounds-options" onChange={e => dispatch(setRoundCount(e.target.value))}>
                    {options.map((option, key) => <option key={key} value={option}>{option} rounds</option>)}
                </select>
                <select className={styles.selectRounds} data-cy="mode-options" onChange={e => dispatch(setGameMode(e.target.value))}>
                    <option value="original">TellTales Images</option>
                    <option value="custom">Custom Images</option>
                </select>
                <span>{error}</span>
                <button className={styles.createRoomButton} data-cy="create-room" type='submit'>Create</button>
            </form>
        </div>
    );
}

export default CreateRoom;
