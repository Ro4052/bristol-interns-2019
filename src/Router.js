import React from 'react';
import { Router, Route } from 'react-router-dom'
import Dashboard from './components/Dashboard/Dashboard';
import Login from './components/Login/Login';
import Auth from './components/Auth/Auth';
import history from './services/history';

export default class Routes extends React.Component {
    render() {
        return (
            <Router history={history}>
                <Route exact path='/' component={Login}/>
                <Route path='/dashboard' render={(props) => <Auth {...props} render={() => <Dashboard/>}/>}/>
            </Router>
        );
    }
}
