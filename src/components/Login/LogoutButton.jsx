import React from 'react';
import { Redirect } from 'react-router-dom';
import styles from './Login.module.css';
import axios from 'axios';

export class LogoutButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedIn: true
        }
        this.logOut = this.logOut.bind(this);
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
        .catch((err) => {
            console.log(err);
            window.alert('Cannot log out of a current game');
        })
    }
    
    render() {        
        return (
            (this.state.loggedIn) ?
            <button className={styles.logOutButton} onClick={this.logOut}>Log out</button>
            : <Redirect to='/'/>
        )
    }
}

export default LogoutButton;
