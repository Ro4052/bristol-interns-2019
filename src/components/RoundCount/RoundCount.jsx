import React from 'react';
import { connect } from 'react-redux';
import styles from '../RoundCount/RoundCount.module.css';
import { setRoundCount } from './RoundCountActions';

export class RoundCount extends React.Component {
    render() {
        const options = [1, 2, 3, 4, 5, 6];
        return (
            <select input="How many rounds in your game?" className={styles.roundCountBox} data-cy="num-rounds-options" onChange={(event) => this.props.setRoundCount(event.target.value)}>
                <option defaultValue disabled>How many rounds in your game?</option>
                {options.map((numRounds, key) => <option key={key}>{numRounds}</option>)}
            </select>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    setRoundCount: numRounds => dispatch(setRoundCount(numRounds))
});

export default connect(null, mapDispatchToProps)(RoundCount);
