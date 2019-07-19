import React from 'react';
import styles from './Button.module.css';

export class Button extends React.Component {
    render() {
        return (
            <button className={styles.button} data-cy={this.props.cy} onClick={this.props.handleClick} type={this.props.type || 'button'}>{this.props.text}</button>
        );
    }
}

export default Button;
