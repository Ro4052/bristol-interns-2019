import React from 'react';
import Button from '../../shared/Button/Button';

export class CreateRoom extends React.Component {
    render() {
        return (
            <Button cy="create-room" handleClick={this.props.createRoom} text="Create Room" />
        );
    }
}

export default CreateRoom;
