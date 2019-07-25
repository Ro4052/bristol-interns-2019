import React from 'react';
import styles from './Timer.module.css';

export class Timer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            seconds: this.props.duration
        };
        this.timeout = null;
        this.decrement = this.decrement.bind(this);
    }

    componentDidMount() {
        this.timeout = setTimeout(this.decrement, 1000);
    }

    componentWillUnmount() {
        this.props.reset();
        clearTimeout(this.timeout);
    }

    decrement() {
        if (this.state.seconds > 0) {
            this.setState({
                seconds: this.state.seconds - 1
            });
            this.timeout = setTimeout(this.decrement, 1000);
        };
    }

    render() {
        return(
            <div data-cy={this.props.cy} className={styles.timer}>
                <span>{this.state.seconds}</span>
            </div>
        );
    };
}

export default Timer;
