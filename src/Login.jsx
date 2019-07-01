import React from 'react';
import styles from './css/Login.module.css';
import axios from 'axios';
import Cookies from 'js-cookie';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: ""
        }
    }
    componentWillMount() {
        if (Cookies.get('username')) {
            window.location = '/dashboard'
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
            console.log(response);
            if (response.status === 200) {
                window.location = '/dashboard'
            }
        })
        .catch(err => {
            console.log(err);
        })
    }
    render() {
        return (
            <div className={styles.loginPage}>
            <form className={styles.loginForm} onSubmit={this.sendLogin.bind(this)}>
                <h2 className={styles.formHeader}>Type a username to enter the game:</h2>
                <input className={styles.loginInput} placeholder="Type in your username" onChange={this.handleChange.bind(this)} autoFocus/>
                <button className={styles.loginButton} type="submit">Log in</button>
            </form>
            </div>
        )
    }
}

export default Login;
