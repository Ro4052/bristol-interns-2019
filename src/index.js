import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import Login from './Login';
import Routes from './Router';

ReactDOM.render(
    <Routes>
        <Login />
    </Routes>, 
document.getElementById('root'));
