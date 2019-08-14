import React from 'react';
import { connect } from 'react-redux';
import styles from './Dashboard.module.css';
import Timothy from '../Timothy/Timothy';
import PlayedCards from '../PlayedCards/PlayedCards';
import MyCards from '../MyCards/MyCards';
import Players from '../Players/Players';
import GameOver from '../GameOver/GameOver';
import Chat from '../Chat/Chat';
import PlayerInteractions from '../PlayerInteractions/PlayerInteractions';
import { authenticateUser } from '../Login/LoginActions';
import PlayWord from '../PlayWord/PlayWord';
import { statusTypes } from '../../services/statusTypes';

export class Dashboard extends React.Component {
    componentDidMount() {
        this.props.authenticateUser();
    }

    render() {
        const showPlayerInteractions = (!this.props.playWord || this.props.word || !this.props.playedCardId) && !(this.props.winner || this.props.drawers.length > 1);
        const showPlayWord = this.props.playWord && !this.props.word && this.props.playedCardId && !(this.props.winner || this.props.drawers.length > 1);
        return (
            <div className={styles.dashboard}>
                <div className={styles.main}>
                    <div className={styles.side}>
                        <div className={styles.gameInfo}>
                            {this.props.status !== statusTypes.NOT_STARTED && <h2>Round: <span id="round-number" data-cy="round-number">{this.props.roundNum}</span></h2>}
                            <Players />
                        </div>
                        <Chat />
                    </div>
                    <div className={styles.middle}>
                        <div className={styles.interactions}>
                            {showPlayerInteractions && <PlayerInteractions />}
                        <Timothy />
                        </div>
                        <div className={styles.centerBox}>
                            {showPlayWord && <PlayWord />}
                            {(this.props.winner || this.props.drawers.length > 1) && <GameOver />}
                            {this.props.status !== statusTypes.GAME_OVER && <PlayedCards />}
                        </div>
                        {this.props.status !== statusTypes.NOT_STARTED && this.props.status !== statusTypes.GAME_OVER && <MyCards />}
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    status: state.dashboardReducer.status,
    roundNum: state.dashboardReducer.roundNum,
    playCard: state.myCardsReducer.playCard,
    playWord: state.playWordReducer.playWord,
    voteCard: state.playedCardsReducer.voteCard,
    playedCardId: state.myCardsReducer.playedCardId,
    winner: state.gameOverReducer.winner,
    drawers: state.gameOverReducer.drawers,
    word: state.playWordReducer.word
});

const mapDispatchToProps = dispatch => ({
    authenticateUser: () => dispatch(authenticateUser())
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
