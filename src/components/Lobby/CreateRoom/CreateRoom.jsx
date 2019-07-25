import React from 'react';
import { connect } from 'react-redux';
import Button from '../../shared/Button/Button';
import { createRoom } from '../LobbyActions';

export class CreateRoom extends React.Component {
    render() {
        return (
            <Button cy="create-room" handleClick={this.props.createRoom} text="Create Room" />
        );
    }
}

const mapStateToProps = (state) => ({
    username: state.authReducer.username
});

const mapDispatchToProps = (dispatch) => ({
    createRoom: () => dispatch(createRoom())
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateRoom);
