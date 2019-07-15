import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { resetState } from '../../store/gameActions';
import { resetPlayerState, resetCookieSuccess, authenticateUser } from '../../store/playerActions';

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
    cookie: state.playerReducer.cookie,
    loading: state.playerReducer.loading
});

const mapDispatchToProps = (dispatch) => ({
    resetState: () => dispatch(resetState()),
    resetPlayerState: () => dispatch(resetPlayerState()),
    authenticateUser: () => dispatch(authenticateUser()),
    resetCookieSuccess: () => dispatch(resetCookieSuccess())
});

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
