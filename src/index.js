import React from 'react';
import ReactDOM from 'react-dom';
import Router from './Router';

import { Provider } from 'react-redux';
import { store } from './store/store';

import './index.css';
import Login from './components/Login/Login';

ReactDOM.render(
    <Provider store={store}>
        <Router/>
    </Provider>
, document.getElementById('root'));
