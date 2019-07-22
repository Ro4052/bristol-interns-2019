import React from 'react';
import axios from 'axios';
import Button from '../../shared/Button/Button';

export class CreateRoom extends React.Component {
    createRoom() {
        axios.get('/api/room/create')
        .catch((err) => {
            console.log(err.message);
        })
    }

    render() {
        return (
            <Button cy="create-room" handleClick={this.createRoom} text="Create Room" />
        );
    }
}

export default CreateRoom;
