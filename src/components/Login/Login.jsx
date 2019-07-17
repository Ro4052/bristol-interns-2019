import React from 'react';
import { connect } from 'react-redux';
import styles from './Login.module.css';
import { Redirect } from 'react-router-dom';
import Monster from '../Monster/Monster';
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

    checkUsernameAllowed(string) {
        // eslint-disable-next-line
        const allowed = /^[A-Za-z0-9]*$/;
        if (allowed.test(string)){
            return true;
        }
        return false;
    }
    
    checkUsername() {
        if (this.state.value === '') {
            this.setState ({
                error: "Username cannot be an empty string"
            })
            return false;
        }
        if (!this.checkUsernameAllowed(this.state.value)) {
            this.setState({
                error: "Username can be comprised of numbers and latin letters only"
            })
            return false;
        }
        if (this.state.value.length < 6) {
            this.setState({
                error: "Username must be at least 6 characters"
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
                     <div className={styles.foo}>
                        <span className={styles.letter} data-letter="D">D</span>
                        <span className={styles.letter} data-letter="i">i</span>
                        <span className={styles.letter} data-letter="X">X</span>
                        <span className={styles.letter} data-letter="i">i</span>
                        <span className={styles.letter} data-letter="t">t</span>

                    </div>
                    <Monster />
                    <form className={styles.loginForm} onSubmit={this.sendLogin.bind(this)}>
                        {this.props.error && (!this.state.error) && <h3 data-cy="login-error" className={styles.errorText}>{this.props.error}</h3>}
                        {this.state.error && <h3 data-cy="username-error" className={styles.errorText}>{this.state.error}</h3>}
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
