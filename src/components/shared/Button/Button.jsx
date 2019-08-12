import React from 'react';
import styles from './Button.module.css';

export class Button extends React.Component {
    render() {
        return (
            <button className={styles.button} data-cy={this.props.cy} type='submit'>{this.props.text}</button>
        );
    }
}

export default Button;
