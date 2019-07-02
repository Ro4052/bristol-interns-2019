import React from 'react';
import ReactDOM from 'react-dom';
import AllCards from './AllCards';

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<AllCards />, div);
    ReactDOM.unmountComponentAtNode(div);
});