import React from 'react';
import ReactDOM from 'react-dom';
import Login from './components/Login/Login';
import Routes from './Router';
import './index.css';

ReactDOM.render(
    <Routes>
        <Login />
    </Routes>, 
document.getElementById('root'));
