import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { authenticateUser } from './AuthActions';

export class Auth extends React.Component {

    componentDidMount() {
        this.props.authenticateUser();
    }

    render() {
        if (this.props.username) return this.props.render();
        return (<Redirect to='/' />);
    }
}

const mapStateToProps = (state) => ({
    username: state.authReducer.username
});

const mapDispatchToProps = (dispatch) => ({
    authenticateUser: () => dispatch(authenticateUser())
});

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
