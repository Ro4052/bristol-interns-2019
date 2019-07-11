import React from 'react';
import styles from './Login.module.css';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import connectSocket from '../../services/socket';

export class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: "",
            error: "",
            loggedIn: false
        }
    }
    componentDidMount() {
        axios.get('/auth', {
            validateStatus: (status) => {
              return status < 500;
            }})
            .then(res => {            
                if (res.status === 200) {
                    this.setState({ loggedIn: true })
                } else if (res.status === 401) {
                    this.setState({ loggedIn: false })
                } else {
                    const error = new Error(res.error);
                    throw error;
                }
            })
            .catch(err => {
                this.setState({ loggedIn: false });
            });
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
            axios.post('/auth/login', {
                username: this.state.value
            })
            .then(() => connectSocket())
            .then(() => {
                this.setState({
                    loggedIn: true
                })
            })
            .catch(err => {                
                if (err.message.includes(409)) {
                    this.setState({
                        error: "Username already exists",
                        loggedIn: false
                    })
                } else if (err.message.includes(400)) {
                    this.setState({
                        error: "Game has already started",
                        loggedIn: false
                    })
                } else {
                    this.setState({
                        error:  err.message,
                        loggedIn: false
                    })
                }
            })
        }
    }
    getInputStyle() {
        return (this.state.error !== '') ? {border: '2px solid #EA3546'} : {};
            
    }
    render() {
        return (
            (!this.state.loggedIn) ?
                <div className={styles.loginPage}>
                     <div className={styles.foo}>
                        <span className={styles.letter} data-letter="D">D</span>
                        <span className={styles.letter} data-letter="i">i</span>
                        <span className={styles.letter} data-letter="X">X</span>
                        <span className={styles.letter} data-letter="i">i</span>
                        <span className={styles.letter} data-letter="t">t</span>

                    </div>
                    <form className={styles.loginForm} onSubmit={this.sendLogin.bind(this)}>
                        <h3 className={styles.errorText}>{this.state.error}</h3>
                        <h2 className={styles.formHeader}>Type a username to enter the game:</h2>
                        <input className={styles.loginInput} style={this.getInputStyle()} value={this.state.value} placeholder="Enter username" onChange={this.handleChange.bind(this)} autoFocus/>
                        <button className={styles.loginButton} type="submit">Log in</button>
                    </form>
                </div>
            : <Redirect to='/dashboard' />
        )
    }
}

export default Login;
