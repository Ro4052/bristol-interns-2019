import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import styles from './Login.module.css';
import Timothy from '../Timothy/Timothy';
import Logo from '../Logo/Logo';
import { authenticateUser, logIn, signUp } from './LoginActions';
import classNames from 'classnames/bind';
import github from '../../images/github.png';

const cx = classNames.bind(styles);

export class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            signUp: false
        };
        this.sendLoginOrSignUp = this.sendLoginOrSignUp.bind(this);
        this.handleChangeUsername = this.handleChangeUsername.bind(this);
        this.handleChangePassword = this.handleChangePassword.bind(this);
        this.toggleSignUp = this.toggleSignUp.bind(this);
    }

    componentDidMount() {
        this.props.authenticateUser();
    }

    handleChangeUsername(event) {
        this.setState({ username: event.target.value });
    }

    handleChangePassword(event) {
        this.setState({ password: event.target.value });
    }

    sendLoginOrSignUp(event) {
        event.preventDefault();           
        (this.state.signUp) ? this.props.signUp(this.state.username, this.state.password) : this.props.logIn(this.state.username, this.state.password);
    }

    toggleSignUp() {
        this.setState({ signUp: !this.state.signUp });
    }

    render() {
        return (
            (!this.props.username) ?
                <div className={styles.loginPage}>
                    <Logo />
                    <form className={styles.loginForm} onSubmit={this.sendLoginOrSignUp} data-cy='login-form' >
                        <h2 className={styles.formHeader}>{this.state.signUp ? "Enter a username and password to sign up for the game" : "Log in with your username and password to enter the game"}</h2>
                        <input type='text' data-cy='username' className={cx(styles.loginInput, { inputError: this.props.error })} username={this.state.username} placeholder="Enter username" onChange={this.handleChangeUsername} autoFocus />
                        <input type='password' data-cy='password' className={cx(styles.loginInput, { inputError: this.props.error })} password={this.state.password} placeholder="Enter password" onChange={this.handleChangePassword} />
                        {this.props.error && <h3 data-cy="login-error" className={styles.errorText}>{this.props.error}</h3>}
                        <button data-cy="login" type='submit'>{this.state.signUp ? "Sign up" : "Log in"}</button>
                    </form>
                    <button data-cy="toggle-signup" onClick={this.toggleSignUp}>{this.state.signUp ? "Already a member? Log in." : "Don't have an account? Sign up"}</button> or
                    <a className={styles.githubLogin} href={this.props.uri}>Log in with GitHub <img src={github} className={styles.githubLogo} alt='github-logo' /></a>
                    <Timothy />
                </div>
            : <Redirect to='/lobby' />
        )
    }
}

const mapStateToProps = state => ({
    username: state.authReducer.username,
    uri: state.authReducer.uri,
    error: state.authReducer.error
});

const mapDispatchToProps = dispatch => ({
    logIn: (username, password) => dispatch(logIn(username, password)),
    signUp: (username, password) => dispatch(signUp(username, password)),
    authenticateUser: () => dispatch(authenticateUser())
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
