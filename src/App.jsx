import React from 'react';
import Dashboard from './components/Dashboard/Dashboard';
import styles from './components/Login/Login.module.css';
import axios from 'axios';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: "",
            error: "",
            loggedIn: false
        }
        this.logOut = this.logOut.bind(this);
    }
    componentWillMount() {
        axios.get('/auth')
        .then((response) => {
            if (response.status !== 200) {
                this.setState({
                    loggedIn: false
                })
            }
        }).catch(err => {
            this.setState({
                loggedIn: false
            })
        })
    }
    handleChange(event) {
        event.preventDefault();
        this.setState({
          value: event.target.value
        })
    }
    deleteAllCookies() {
        var cookies = document.cookie.split(";");
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i];
            var eqPos = cookie.indexOf("=");
            var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = name + "=;expires=Thu, 01 Jan 1975 00:00:00 GMT";
        }
    }
    sendLogin(event) {
        event.preventDefault();
        axios.post('/auth/login', {
            username: this.state.value
        })
        .then(response => {
            if (response.status === 200) {
                this.setState ({
                    loggedIn: true
                })
            }
        })
        .catch(err => {
            this.setState({
                loggedIn: false,
                error: err.message
            })
        })
    }
    logOut() {
        axios.post('/auth/logout')
        .then(response => {
            if (response.status === 200) {
                this.deleteAllCookies();
                this.setState({
                    loggedIn: false
                })
            }
        })
        .catch(() => {
            window.alert('Cannot log out of a current game');
        })
    }
    render() {      
        return (
            (!this.state.loggedIn) ? 
            <div className={styles.loginPage}>
            <form className={styles.loginForm} onSubmit={this.sendLogin.bind(this)}>
                <h3 className={styles.errorText}>{this.state.error}</h3>
                <h2 className={styles.formHeader}>Type a username to enter the game:</h2>
                <input className={styles.loginInput} placeholder="Type in your username" onChange={this.handleChange.bind(this)} autoFocus/>
                <button className={styles.loginButton} type="submit">Log in</button>
            </form>
            </div>
            :
            <> 
                <Dashboard/>
                <button className={styles.logOutButton} onClick={this.logOut}>Log out</button>
            </>
        )
    }
}