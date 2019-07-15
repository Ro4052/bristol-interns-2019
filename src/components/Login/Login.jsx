import React from 'react';
import { connect } from 'react-redux';
import styles from './Login.module.css';
import { Redirect } from 'react-router-dom';
import Monster from '../Monster/Monster';
import Dixit from '../Dixit/Dixit';
import { logIn, authenticateUser } from '../../store/playerActions';

export class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: ""
        }
    }

    componentDidMount() {
        this.props.authenticateUser();
    }

    handleChange(event) {
        event.preventDefault();
        this.setState({
          value: event.target.value
        })
    }

    checkSpecialChar(string) {
        // eslint-disable-next-line
        var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
        if (format.test(string)){
            return true;
        } else {
            return false;
        }
    }
    
    checkUsername() {
        if (this.state.value === '') {
            this.setState ({
                error: "Username cannot be an empty string"
            })
            return false;
        }
        if (this.checkSpecialChar(this.state.value)) {
            this.setState({
                error: "Username cannot contain special characters"
            })
            return false;
        }
        return true;
    }

    sendLogin(event) {
        event.preventDefault();
        if (this.checkUsername()) {
            this.props.logIn(this.state.value);
        }
    }

    getInputStyle() {        
        return (this.props.error) ? {border: '2px solid #EA3546'} : {};
    }

    render() {             
        return (
            (!this.props.cookie) ?
                <div className={styles.loginPage}>
                    <Dixit />
                    <Monster />
                    <form className={styles.loginForm} onSubmit={this.sendLogin.bind(this)}>
                        <h3 data-cy="login-error" className={styles.errorText}>{}</h3>
                        <h2 className={styles.formHeader}>Type a username to enter the game:</h2>
                        <input className={styles.loginInput} style={this.getInputStyle()} value={this.state.value} placeholder="Enter username" onChange={this.handleChange.bind(this)} autoFocus/>
                        <button className={styles.loginButton} type="submit">Log in</button>
                    </form>
                </div>
            : <Redirect to='/dashboard' />
        )
    }
}

const mapStateToProps = (state) => ({
    cookie: state.playerReducer.cookie,
    loading: state.playerReducer.loading,
    error: state.playerReducer.error
});

const mapDispatchToProps = (dispatch) => ({
    logIn: (username) => dispatch(logIn(username)),
    authenticateUser: () => dispatch(authenticateUser())
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
