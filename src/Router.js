import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom'
import Dashboard from './components/Dashboard/Dashboard';
import Login from './components/Login/Login';
import Auth from './components/Auth/Auth';

export default class Routes extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <Route exact path='/' component={Login}/>
                <Route path='/dashboard' render={(props) => <Auth {...props} render={() => <Dashboard/>}/>}/>
            </BrowserRouter>
        );
    }
}