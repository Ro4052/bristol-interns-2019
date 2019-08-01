import React from 'react';
import { connect } from 'react-redux';
import styles from '../RoundCount/RoundCount.module.css';
import { setRoundCount } from './RoundCountActions';

export class RoundCount extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.props.setRoundCount(event.target.value)
    }

    render() {
        const options = [1,2,3,4,5,6]
        return (
            <select input="How many rounds in your game?" className={styles.roundCountBox} data-cy = "Drop-Down" onChange={this.handleChange}>
                <option selected disabled>How many rounds in your game? </option>
                {options.map((number, key) => <option cy = {number} key={key}>{number}</option>)}
            </select>
        );
    }
}

const mapDispatchToProps = (dispatch) => ({
    setRoundCount: number => dispatch(setRoundCount(number))
});

export default connect(null, mapDispatchToProps)(RoundCount);
