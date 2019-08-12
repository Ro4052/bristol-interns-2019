import React from 'react';
import { Router, Route } from 'react-router-dom'
import Dashboard from './components/Dashboard/Dashboard';
import Lobby from './components/Lobby/Lobby';
import Login from './components/Login/Login';
import LeaderBoard from './components/Leaderboard/Leaderboard';
import history from './services/history';

export default class Routes extends React.Component {
    render() {
        return (
            <Router history={history}>
                <Route exact path='/' component={Login}/>
                <Route path='/lobby' component={Lobby}/>
                <Route path='/dashboard' component={Dashboard}/>
                <Route path='/leaderboard' component={LeaderBoard}/>
            </Router>
        );
    }
}
