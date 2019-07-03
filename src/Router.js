import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom'
import Dashboard from './components/Dashboard/Dashboard';
import Login from './components/Login/Login';
import axios from 'axios';

export default class Routes extends React.Component {
    componentDidUpdate() {
        axios.get('/auth')
        .then((response) => {
            if (response.status === 200) {
                if (response.data.loggedIn && window.location.pathname !== '/dashboard') {
                    window.location = '/dashboard'
                } 
                if (!response.data.loggedIn && window.location.pathname === '/dashboard') {
                    window.location = '/';
                }
            }
        }).catch(() => {
            if (window.location.pathname !== '/') {
                window.location = '/';
            }
        })
    }
    render() {
        return (
            <BrowserRouter>
                <Route exact path='/' component={Login}/>
                <Route path='/dashboard' component={Dashboard}/>
            </BrowserRouter>
        );
    }
}