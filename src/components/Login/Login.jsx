import React from 'react';
import styles from './Login.module.css';
import axios from 'axios';
import Auth from '../Auth';

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
    checkSpecialChar(string) {        
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
            .then(response => {        
                if (response.status === 200) {
                    window.location = '/dashboard';
                }
            })
            .catch(err => {                
                if (err.message.includes(400)) {
                    this.setState({
                        error: "Username already exists"
                    })
                } else {
                    this.setState({
                        error:  err.message
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
            <div className={styles.loginPage}>
            <Auth/>
            <form className={styles.loginForm} onSubmit={this.sendLogin.bind(this)}>
                <h3 className={styles.errorText}>{this.state.error}</h3>
                <h2 className={styles.formHeader}>Type a username to enter the game:</h2>
                <input className={styles.loginInput} style={this.getInputStyle()} value={this.state.value} placeholder="Type in your username" onChange={this.handleChange.bind(this)} autoFocus/>
                <button className={styles.loginButton} type="submit">Log in</button>
            </form>
            </div>
        )
    }
}

export default Login;
