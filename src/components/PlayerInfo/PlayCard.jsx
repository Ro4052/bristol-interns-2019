import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import style from '../Dashboard/Dashboard.module.css';
import { finishPlayCard } from '../../store/playerActions';

export class PlayCard extends React.Component {

    constructor(props) {
        super(props);
        this.startGame = this.startGame.bind(this);
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
        // console.log("playWordAndCard", this.props.playWordAndCard);
        // console.log("playCard", this.props.playCard);
        // console.log("status", this.props.status);
        return (
            <div className={style.playerInteractions}>
                Play card
                {/* {this.props.playWordAndCard && !this.props.myWord && <h3>Type in a word</h3>} */}
                {/* {(this.props.playCard || this.props.playWordAndCard) && !this.props.playedCard && <h3>Pick a card</h3>} */}
                {/* {this.props.playCard && this.props.playedCard && <button id="end-turn" onClick={this.endTurn}>End my turn</button>} */}
                {/* {!(pickCardText || pickWordText) && this.props.myTurn} */}
                {/* <Message /> */}
                {/* {this.props.status === "NOT_STARTED" && <button id="start-game" onClick={this.startGame}>Start game</button>} */}
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
});

const mapDispatchToProps = (dispatch) => ({
    finishPlayCard: (id) => dispatch(finishPlayCard(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(PlayCard);
