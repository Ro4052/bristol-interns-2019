import React from 'react';
import styles from './Button.module.css';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

export class Button extends React.Component {
    render() {
        return (
            <button className={cx(styles.button, {logout: this.props.cy === 'logout'})} data-cy={this.props.cy} onClick={this.props.handleClick} type={this.props.type || 'button'}>{this.props.text}</button>
        );
    }
}

export default Button;
