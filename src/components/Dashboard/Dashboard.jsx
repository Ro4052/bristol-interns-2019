import React from 'react';
import Turn from '../Turn/Turn';
import Cards from '../Cards/Cards';
import Message from '../Message/Message';
import styles from './Dashboard.module.css';
import axios from 'axios';

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: "Waiting for a button press..."
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
                window.location = '/'
            }
        })
        .catch(err => {
            console.log(err);
        })
    }
    render() {            
        return (
        <>
            <div>{this.state.text}</div>
            <button className={styles.logOutButton} onClick={this.logOut}>Log out</button>
            <Cards/>
            <Turn />
            <Message />
        </>
        )
    }
}

export default Dashboard;
