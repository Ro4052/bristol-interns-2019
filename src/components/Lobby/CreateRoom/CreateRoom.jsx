import React from 'react';
import Button from '../../shared/Button/Button';
import styles from '../Lobby.module.css';

export class CreateRoom extends React.Component {
    render() {
        return (
            <div className={styles.createRoom}>
                <Button cy="create-room" handleClick={this.props.createRoom} text="Create Room" />
            </div>
        );
    }
}

export default CreateRoom;
