import React from 'react';

export class Prompt extends React.Component {

    render() {
        return (
            <div>
            <h3 data-cy={this.props.cy}>{this.props.text}</h3>
        </div>
        );
    }
}

export default Prompt;
