import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom'
import ExampleComponent from './exampleComponent/ExampleComponent';
import Login from './Login';
import axios from 'axios';

export default class Routes extends React.Component {

    render() {
        return (
            <BrowserRouter>
                <Route exact path='/' component={Login}/>
                <Route path='/dashboard' component={ExampleComponent}/>
            </BrowserRouter>
        );
    }
}