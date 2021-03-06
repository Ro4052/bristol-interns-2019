import React from 'react';
import styles from './Timer.module.css';

export class Timer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.timeout = null;
        this.decrement = this.decrement.bind(this);
    }

    componentDidMount() {
        this.timeout = setTimeout(this.decrement, 1000);
    }

    componentWillUnmount() {
        this.props.setDuration(0);
        clearTimeout(this.timeout);
    }

    decrement() {
        this.props.setDuration(this.props.duration - 1);
        this.timeout = setTimeout(this.decrement, 1000);
    }

    render() {
        return(
            <div data-cy={this.props.cy} className={styles.timer}>{this.props.duration}</div>
        );
    };
}

export default Timer;
