import React from 'react';
import ReactDOM from 'react-dom';
import Turn from './Turn';

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Turn />, div);
    ReactDOM.unmountComponentAtNode(div);
});