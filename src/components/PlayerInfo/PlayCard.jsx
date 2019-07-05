import React from 'react';
import { connect } from 'react-redux';
import styles from './PlayWordAndCard.module.css';
import { finishPlayCard } from '../../store/playerActions';

export class PlayCard extends React.Component {

    render() {
        return (
            <div className={styles.playerInteractions}>
                {this.props.currentWord && <h3>{"Current word: " + this.props.currentWord}</h3>}
                {!this.props.playedCard && <h3>Pick a card</h3>}
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    currentWord: state.reducer.currentWord
});

const mapDispatchToProps = (dispatch) => ({
    finishPlayCard: (id) => dispatch(finishPlayCard(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(PlayCard);
