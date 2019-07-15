import React from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import { connect } from 'react-redux';
import { resetState } from '../../store/gameActions';
import { resetPlayerState } from '../../store/playerActions';

export class Auth extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            authenticated: false
        };
    }

    componentDidMount() {
        axios.get('/auth', {
        validateStatus: (status) => {
            return status < 500;
        }})
        .then(res => {            
            if (res.status === 200) {
                this.setState({ loading: false, authenticated: true });
            } else if (res.status === 401) {
                this.props.resetState();
                this.props.resetPlayerState();
                this.setState({ loading: false, authenticated: false });
            } else {
                const error = new Error(res.error);
                throw error;
            }
        })
        .catch(err => {
            this.setState({ loading: false, authenticated: false });
        });
    }

    componentDidUpdate() {
        if (this.state.authenticated && !this.props.cookie) {
            this.props.history.push('/');
        }
    }

    render() {
        const { loading, authenticated } = this.state;
        if (loading) return null;
        if (authenticated) return this.props.render();
        return (<Redirect to='/' />);
    }
}

const mapStateToProps = (state) => ({
    cookie: state.playerReducer.cookie 
});

const mapDispatchToProps = (dispatch) => ({
    resetState: () => dispatch(resetState()),
    resetPlayerState: () => dispatch(resetPlayerState())
});

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
