import React from 'react';
import { Router, Route } from 'react-router-dom'
import Dashboard from './components/Dashboard/Dashboard';
import Lobby from './components/Lobby/Lobby';
import Login from './components/Login/Login';
import Leaderboard from './components/Leaderboard/Leaderboard';
import history from './services/history';
import Upload from './components/Upload/Upload';

export default class Routes extends React.Component {
    render() {
        return (
            <Router history={history}>
                <Route exact path='/' component={Login}/>
                <Route path='/lobby' component={Lobby}/>
                <Route path='/dashboard' component={Dashboard}/>
                <Route path='/leaderboard' component={Leaderboard}/>
                <Route path='/upload' component={Upload}/>
            </Router>
        );
    }
}
