import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { authenticateUser } from '../../store/playerActions';

export class Auth extends React.Component {

    componentDidMount() {
        this.props.authenticateUser();
    }

    render() {
        if (this.props.cookie) return this.props.render();
        return (<Redirect to='/' />);
    }
}

const mapStateToProps = (state) => ({
    cookie: state.playerReducer.cookie
});

const mapDispatchToProps = (dispatch) => ({
    authenticateUser: () => dispatch(authenticateUser())
});

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
