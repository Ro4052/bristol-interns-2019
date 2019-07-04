import React from 'react';
import axios from 'axios';

export default class Auth extends React.Component {
    componentDidMount() {
        axios.get('/auth')
        .then((response) => {
            console.log(response);
            if (response.status === 200) {
                if (window.location.pathname !== '/dashboard') {
                    window.location = '/dashboard'
                } 
            }
        }).catch((err) => {
            console.log(err);
            
            if (window.location.pathname !== '/') {
                window.location = '/';
            }
        })
    }
    render() {
        return null;
    }
}