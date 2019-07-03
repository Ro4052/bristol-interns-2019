import React from 'react';
import styles from './Login.module.css';
import axios from 'axios';

export class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: "",
            error: ""
        }
    }
    handleChange(event) {
        event.preventDefault();
        this.setState({
          value: event.target.value
        })
    }
    sendLogin(event) {
        event.preventDefault();
        axios.post('/auth/login', {
            username: this.state.value
        })
        .then(response => {
            if (response.status === 200) {
                window.location = '/dashboard';
            }
        })
        .catch(err => {
            this.setState({
                error: err.message
            })
        })
    }
    render() {        
        return (
            <div className={styles.loginPage}>
            <form className={styles.loginForm} onSubmit={this.sendLogin.bind(this)}>
                <h3 className={styles.errorText}>{this.state.error}</h3>
                <h2 className={styles.formHeader}>Type a username to enter the game:</h2>
                <input className={styles.loginInput} value={this.state.value} placeholder="Type in your username" onChange={this.handleChange.bind(this)} autoFocus/>
                <button className={styles.loginButton} type="submit">Log in</button>
            </form>
            </div>
        )
    }
}

export default Login;
