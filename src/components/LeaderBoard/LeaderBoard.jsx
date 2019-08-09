import React from 'react';
import { connect } from 'react-redux';
import styles from './LeaderBoard.module.css';
import history from '../../services/history';
import { setPlayers } from './LeaderBoardActions';

export class LeaderBoard extends React.Component {
    componentDidMount() {
        this.props.setPlayers();
    }

    render() {
        console.log(this.props.players);
        return (
            <div className={styles.leaderBoardPage}>
                <ul className={styles.leaderBoard}>
                    <h3>Leader Board</h3>
                    {this.props.players.map(player => <li>{player.score} {player.name}</li>)}
                </ul>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    players: state.leaderBoardReducer.players
});

const mapDispatchToProps = dispatch => ({
    setPlayers: () => dispatch(setPlayers())
});

export default connect(mapStateToProps, mapDispatchToProps)(LeaderBoard);
