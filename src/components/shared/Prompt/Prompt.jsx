import React from 'react';
import styles from './Prompt.module.css';

export class Prompt extends React.Component {
    render() {
        return (
            <h3 className={styles.prompt} data-cy={this.props.cy}>{this.props.text}</h3>
        );
    }
}

export default Prompt;
