import React from 'react';
import { connect } from 'react-redux';
import styles from './LeaderBoard.module.css';
import history from '../../services/history';

export class LeaderBoard extends React.Component {
    render() {        
        return (
            <div className={styles.leaderBoardPage}>
                <ul className={styles.leaderBoard}>
                    <h3>Leader Board</h3>
                    {this.props.players.map(player => <li>{player}</li>)}
                </ul>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    players: state.leaderBoardReducer.players
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(LeaderBoard);
