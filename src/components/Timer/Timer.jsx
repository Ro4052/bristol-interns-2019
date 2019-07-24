import React from 'react';
// import styles from './Timer.module.css';

export class Timer extends React.Component {
    constructor() {
        super();
        this.decrement = this.decrement.bind(this);
        this.state = {
            seconds: 3
        };

    }

    componentDidMount() {
        setTimeout(this.decrement, 1000)
    }
    
    decrement() {
        if (this.state.seconds>0) {
            this.state.seconds--;
            this.setState({
                    seconds : this.state.seconds
            });
            setTimeout(this.decrement,1000)
        }
    }

    render() {
        return(
            <div id="timer">
                <span>{this.state.seconds}</span>
            </div>
        );
    }
}

export default Timer;
