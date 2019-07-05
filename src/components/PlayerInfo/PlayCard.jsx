import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import style from '../Dashboard/Dashboard.module.css';
import { finishPlayCard } from '../../store/playerActions';

export class PlayCard extends React.Component {

    constructor(props) {
        super(props);
        this.endTurn = this.endTurn.bind(this);
    }

    endTurn() {        
        if (this.props.myWord && this.props.playedCard) {
            axios.post('/api/playCardWord', {
                card: this.props.playedCard,
                word: this.props.myWord
            })
            .then(() => {
                this.props.finishPlayCard(this.props.playedCard)
            })
            .catch(err => {
                console.log(err);
            });
        }
    }

    render() {
        return (
            <div className={style.playerInteractions}>
                {this.props.currentWord && <h3>{this.props.currentWord}</h3>}
                {!this.props.playedCard && <h3>Pick a card</h3>}
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    // status: state.reducer.status,
    // playWordAndCard: state.playerReducer.playWordAndCard,
    // playCard: state.playerReducer.playCard,
    // myWord: state.playerReducer.myWord,
    // playedCard: state.playerReducer.playedCard
    currentWord: state.reducer.currentWord
});

const mapDispatchToProps = (dispatch) => ({
    finishPlayCard: (id) => dispatch(finishPlayCard(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(PlayCard);
