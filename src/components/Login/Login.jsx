import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import styles from './Login.module.css';
import Monster from '../Monster/Monster';
import Dixit from '../Dixit/Dixit';
import Button from '../shared/Button/Button';
import { authenticateUser, logIn } from './LoginActions';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

export class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            value: ""
        };
        this.sendLogin = this.sendLogin.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        this.props.authenticateUser();
    }

    handleChange(event) {
        this.setState({ value: event.target.value });
    }

    sendLogin(event) {
        event.preventDefault();
        this.props.logIn(this.state.value);
    }

    render() {
        return (
            (!this.props.username) ?
                <div className={styles.loginPage}>
                    <Dixit />
                    <Monster />
                    <form className={styles.loginForm} onSubmit={this.sendLogin}>
                        <h2 className={styles.formHeader}>Type a username to enter the game:</h2>
                        <input className={cx(styles.loginInput, { inputError: this.props.error })} value={this.state.value} placeholder="Enter username" onChange={this.handleChange} autoFocus />
                        {this.props.error && <h3 data-cy="login-error" className={styles.errorText}>{this.props.error}</h3>}
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
