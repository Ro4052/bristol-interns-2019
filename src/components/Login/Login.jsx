import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import styles from './Login.module.css';
import Monster from '../Monster/Monster';
import Dixit from '../Dixit/Dixit';
import Button from '../shared/Button/Button';
import { authenticateUser, logIn } from './LoginActions';

export class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: ""
        }
        this.sendLogin = this.sendLogin.bind(this);
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

    checkUsernameAllowed(string) {
        // eslint-disable-next-line
        const allowed = /^[A-Za-z0-9]*$/;
        return allowed.test(string);
    }

    checkUsername() {
        if (this.state.value === '') {
            this.setState ({
                error: "Username cannot be an empty string"
            });
            return false;
        }
        if (!this.checkUsernameAllowed(this.state.value)) {
            this.setState({
                error: "Username can be comprised of numbers and latin letters only"
            });
            return false;
        }
        if (this.state.value.length < 3) {
            this.setState({
                error: "Username must be at least 3 characters"
            });
            return false;
        }
        if (this.state.value.length > 15) {
            this.setState({
                error: "Username must be no longer than 15 characters"
            });
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
            (!this.props.username) ?
                <div className={styles.loginPage}>
                    <Dixit />
                    <Monster />
                    <form className={styles.loginForm} onSubmit={this.sendLogin}>
                        {this.props.error && (!this.state.error) && <h3 data-cy="login-error" className={styles.errorText}>{this.props.error}</h3>}
                        {this.state.error && <h3 data-cy="username-error" className={styles.errorText}>{this.state.error}</h3>}
                        <h2 className={styles.formHeader}>Type a username to enter the game:</h2>
                        <input className={styles.loginInput} style={this.getInputStyle()} value={this.state.value} placeholder="Enter username" onChange={this.handleChange.bind(this)} autoFocus/>
                        <Button cy="login" handeClick={this.sendLogin} type="submit" text="Log in" />
                    </form>
                </div>
            : <Redirect to='/lobby' />
        )
    }
}

const mapStateToProps = (state) => ({
    username: state.authReducer.username,
    error: state.authReducer.error
});

const mapDispatchToProps = (dispatch) => ({
    logIn: (username) => dispatch(logIn(username)),
    authenticateUser: () => dispatch(authenticateUser())
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
